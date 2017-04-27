/* @flow */

import FS from 'sb-fs'
import Path from 'path'
import Command from '../command'
import { CLIError } from '../common'

const REGEXP_EXTRACTION = /^([0-9a-z-_.]+)\/([0-9a-z-_.]+)/i

export default class GetCommand extends Command {
  name = 'get <path>'
  description = 'Clone a remote repository into Projects root (eg. user/repo)'

  async callback(options: Object, path: string = '') {
    const matches = REGEXP_EXTRACTION.exec(path)
    if (!matches) {
      throw new CLIError('Please specify a valid path in user/repo format')
    }
    const [owner, project] = matches.slice(1, 3)
    const projectPath = Path.join(this.projectsRoot, owner, project)
    let projectPathStats
    try {
      projectPathStats = await FS.stat(projectPath)
    } catch (_) { /* No Op */ }
    if (projectPathStats) {
      throw new CLIError(`Target directory '${projectPath}' already exists`)
    }
    await this.spawn('git', ['clone', `git@github.com:${owner}/${project}.git`, projectPath], {
      stdio: 'inherit',
    })
  }
}
