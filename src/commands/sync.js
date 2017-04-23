/* @flow */

import Command from '../command'
import { CLIError } from '../common'

export default class SyncCommand extends Command {
  name = 'sync'
  description = 'Sync upstream changes in current project or defined scope'

  async callback(options: Object) {
    let projects = []
    if (options.scope) {
      projects = this.matchProjects(await this.getProjects(), [].concat(options.scope))
    } else {
      const currentProject = await this.getCurrentProject()
      if (!currentProject) {
        throw new CLIError('Current directory is not a valid project')
      }
      projects.push(currentProject)
    }

    await this.tasks(projects.map(project => ({
      title: `Syncing ${project.slug}`,
      callback: async () => {
        const { code: exitCode } = await this.spawn('git', ['fetch', '--prune', '--all'], {
          cwd: project.path,
          stdio: 'ignore',
        })
        if (exitCode !== 0) {
          throw new CLIError(`Error syncing '${project.slug}'`)
        }
      },
    })))
  }
}
