/* @flow */

import Command from '../command'
import { CLIError } from '../common'

export default class SyncCommand extends Command {
  name = 'sync'
  description = 'Sync upstream changes'

  async callback() {
    const projects = await this.getProjects()
    if (!projects.length) {
      throw new CLIError("You don't have any projects to sync")
    }
    const promises = []
    const syncRepo = project => this.spawn('git', ['fetch', '--all'], { stdio: 'inherit', cwd: project.path })
    projects.map((project) => {
      promises.push(syncRepo(project))
    })
    await Promise.all(promises).then((results) => {
      console.log('results', results)
      return results
    }).catch(e => new CLIError('Something went wrong syncing your repos:', e))
  }
}
