/* @flow */

import FS from 'sb-fs'
import Path from 'path'
import Command from '../command'
import { getGHAllPages, CLIError } from '../common'

export default class GetAllCommand extends Command {
  name = 'get-all <username>'
  description = 'Clones all repositories of a given user (excluding those that already exist)'

  async callback(options: Object, username: string) {
    let repositories
    try {
      repositories = await getGHAllPages(`https://api.github.com/users/${username}/repos`)
    } catch (_) {
      console.log(_)
      throw new CLIError(`Failed to retrieve repositories for '${username}'`)
    }
    await this.tasks(
      repositories.map(repository => ({
        title: `${repository.name}`,
        callback: async (ctx, task) => {
          const projectPath = Path.join(this.projectsRoot, username, repository.name)
          let projectPathStats
          try {
            projectPathStats = await FS.stat(projectPath)
          } catch (_) {
            /* No Op */
          }
          if (projectPathStats) {
            task.skip('Project already exists')
            return
          }
          const { code: exitCode } = await this.spawn('git', ['clone', repository.ssh_url, projectPath], {
            stdio: 'ignore',
          })
          if (exitCode !== 0) {
            throw new CLIError(`Failed to clone repository: ${username}/${repository.name}`)
          }
        },
      })),
      {
        bare: true,
      },
    )
  }
}
