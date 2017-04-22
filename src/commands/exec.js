/* @flow */

import Command from '../command'

export default class ExecCommand extends Command {
  name = 'exec [command]'
  description = 'Execute a given command in currnet project or in projects that match given scope'

  callback() {
    console.log(this.projectsRoot)
  }
}
