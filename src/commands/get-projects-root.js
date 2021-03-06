/* @flow */

import Command from '../command'

export default class GetProjectsRootCommand extends Command {
  name = 'get-projects-root'
  description = 'Show the active projects root'

  callback() {
    console.log(this.projectsRoot)
  }
}
