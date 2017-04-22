/* @flow */

import invariant from 'assert'
import Commands from './commands'
import type CommandType from './command'

class CLI {
  commands: Map<string, CommandType>;
  projectsRoot: string;
  constructor(projectsRoot: string) {
    invariant(projectsRoot && typeof projectsRoot === 'string', 'projectsRoot must be a valid string')

    this.commands = new Map()
    this.projectsRoot = projectsRoot

    Commands.forEach(entry => this.addCommand(entry))
  }
  getCommands(): Map<string, CommandType> {
    return new Map(this.commands)
  }
  addCommand(Command: Class<CommandType>) {
    const instance = new Command(this.projectsRoot)
    if (!instance.name || typeof instance.name !== 'string') {
      throw new Error('Command.name must be a valid string')
    }
    if (!instance.description || typeof instance.description !== 'string') {
      throw new Error('Command.description must be a valid string')
    }
    if (this.commands.has(instance.name)) {
      throw new Error(`Command '${instance.name}' already exists`)
    }
    this.commands.set(instance.name, instance)
  }
  removeCommand(name: string): boolean {
    return this.commands.delete(name)
  }
}

module.exports = CLI
