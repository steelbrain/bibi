/* @flow */

import FS from 'sb-fs'
import Path from 'path'
import promisify from 'sb-promisify'
import parseGitUrl from 'git-url-parse'

import Command from '../command'
import { CLIError } from '../common'

const mv = promisify(require('mv'))
const mkdirp = promisify(require('mkdirp'))

export default class ImportCommand extends Command {
  name = 'import'
  description = 'Import the current directory inside project root'

  async callback() {
    const currentDirectory = process.cwd()
    if (currentDirectory.toLowerCase().startsWith(this.projectsRoot.toLowerCase())) {
      throw new CLIError('Current directory is already inside Projects root')
    }

    const { code: gitExitCode, stdout: gitRemoteURL } = await this.spawn('git', ['remote', 'get-url', 'origin'], { cwd: currentDirectory })
    if (gitExitCode !== 0) {
      throw new CLIError('Either current directory is not a git repository or it doesnt have a valid remote "origin"')
    }
    const parsedRemoteUrl = parseGitUrl(gitRemoteURL)
    if (parsedRemoteUrl.resource !== 'github.com') {
      throw new CLIError('Only github.com repositories are supported')
    }

    const projectPath = Path.join(this.projectsRoot, parsedRemoteUrl.owner, parsedRemoteUrl.name)
    let projectPathStats
    try {
      projectPathStats = await FS.stat(projectPath)
    } catch (_) { /* No Op */ }
    if (projectPathStats) {
      throw new CLIError(`Target directory '${projectPath}' already exists`)
    }
    await mkdirp(Path.join(this.projectsRoot, parsedRemoteUrl.owner))
    await mv(currentDirectory, projectPath)
    console.log(`Moved to '${projectPath}' successfully 🎉`)
  }
}
