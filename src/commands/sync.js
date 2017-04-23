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
    const promises = projects.map(project =>
      this.spawn('git', ['fetch', '--all'], { stdio: 'inherit', cwd: project.path }),
    )
    try {
      const results = await Promise.all(promises)
      console.log('results', results)
    } catch (error) {
      throw new CLIError(`Something went wrong with syncing your repos: ${error.message}`)
    }
  }
}
