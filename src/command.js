/* @flow */

import invariant from 'assert'
import ChildProcess from 'child_process'

export default class Command {
  name = ''
  description = ''

  projectsRoot: string;
  constructor(projectsRoot: string) {
    invariant(projectsRoot && typeof projectsRoot === 'string', 'projectsRoot must be a valid string')

    this.projectsRoot = projectsRoot
  }
  callback() {
    throw new Error('You must implement a callback() method in your command')
  }
  async spawn(
    name: string,
    parameters: Array<string>,
    options: Object,
  ): Promise<{ code: number, stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
      const data = { stdout: [], stderr: [] }
      const spawned = ChildProcess.spawn(name, parameters, options)

      if (spawned.stdout) {
        spawned.stdout.on('data', function(chunk) {
          data.stdout.push(chunk)
        })
      }
      if (spawned.stderr) {
        spawned.stderr.on('data', function(chunk) {
          data.stderr.push(chunk)
        })
      }

      spawned.on('exit', (exitCode) => {
        resolve({ code: exitCode, stdout: data.stdout.join('').trim(), stderr: data.stderr.join('').trim() })
      })
      spawned.on('error', reject)
    }).catch(function(error) {
      if (error && typeof error === 'object' && options.cwd) {
        // eslint-disable-next-line no-param-reassign
        error.directory = options.cwd
      }
      throw error
    })
  }
}
