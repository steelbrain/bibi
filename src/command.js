/* @flow */

import invariant from 'assert'

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
}
