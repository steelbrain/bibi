#!/usr/bin/env node
/* @flow */

require('process-bootstrap')('sb-cli')

const command = require('sb-command')
const untildify = require('untildify')

const CLI = require('../')
const manifest = require('../../package.json')

const projectsRoot = untildify(process.env.SB_PROJECT_PATH || '~/Projects')
const cli = new CLI(projectsRoot)

command
  .version(manifest.version)
  .description('A repository management tool')
  .option('--scope', 'Scope for execution (eg $user, $user/$repo, */$repo, $user/some-*)')

cli.getCommands().forEach(function(entry) {
  command.command(entry.name, entry.description, (...params) => entry.callback.call(entry, ...params))
})

command.process()
