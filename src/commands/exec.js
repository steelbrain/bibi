/* @flow */

import Command from '../command'
import { CLIError } from '../common'
import type { Project } from '../types'

export default class ExecCommand extends Command {
  name = 'exec <command...>'
  description = 'Execute the given command in active project or defined scope'
  options = [
    { title: '--parallel', description: 'Run tasks in parallel', default: false },
    {
      title: '--parallel-limit [limit]',
      description: 'How many tasks to run in parallel at any given time (default: Unlimited)',
      default: Infinity,
    },
  ]

  async callback(options: Object, command: Array<string>) {
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
    if (options.parallel) {
      await this.runParallel(projects, command, options.parallelLimit)
    } else {
      await this.runSequential(projects, command)
    }
  }
  async runSequential(projects: Array<Project>, command: Array<string>): Promise<void> {
    for (const entry of projects) {
      await this.spawn(command[0], command.slice(1), {
        cwd: entry.path,
        stdio: 'inherit',
      })
    }
  }
  async runParallel(projects: Array<Project>, command: Array<string>, limit: number) {
    const remaining = projects.slice()

    const spawnAnother = async () => {
      const entry = remaining.pop()
      if (!entry) return
      await this.spawn(command[0], command.slice(1), {
        cwd: entry.path,
        stdio: 'inherit',
      })
      await spawnAnother()
    }
    const promises = []

    for (let i = 0; i < limit; i++) {
      promises.push(spawnAnother())
    }
    await Promise.all(promises)
  }
}
