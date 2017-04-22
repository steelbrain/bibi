/* @flow */

import Command from '../command'

export default class SyncCommand extends Command {
  name = 'sync'
  description = 'Sync upstream changes'

  callback() {
    console.log('sync', this.projectsRoot)
  }
}
