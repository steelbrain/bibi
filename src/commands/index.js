/* @flow */

import GetCommand from './get'
import ExecCommand from './exec'
import SyncCommand from './sync'
import ImportCommand from './import'
import GetAllCommand from './get-all'
import GetProjectsRootCommand from './get-projects-root'

export default [
  GetCommand,
  GetAllCommand,
  ExecCommand,
  SyncCommand,
  ImportCommand,
  GetProjectsRootCommand,
]
