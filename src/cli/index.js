#!/usr/bin/env node
/* @flow */

require('process-bootstrap')('sb-cli')

const FS = require('fs')
const command = require('sb-command')
const untildify = require('untildify')

const CLI = require('../')
const manifest = require('../../package.json')

const projectsRoot = untildify(process.env.SB_PROJECT_PATH || '~/Projects')
const cli = new CLI(projectsRoot)

// Validations
let stats
try {
  stats = FS.statSync(projectsRoot)
} catch (_) { /* No OP */ }

if (!stats) {
  FS.mkdirSync(projectsRoot)
} else if (!stats.isDirectory()) {
  console.error(`Projects root '${projectsRoot}' exists but is not a directory`)
  process.exit(1)
}
require('sudo-block')()
require('update-notifier')({ pkg: manifest }).notify()

// Initialization
command
  .version(manifest.version)
  .description('A repository management tool')
  .option('--scope [scope]', 'Scope for execution (eg $user, $user/$repo, */$repo, $user/some-*)')

cli.getCommands().forEach(function(entry) {
  command.command(entry.name, entry.description, (...params) => entry.callback.call(entry, ...params))
  entry.options.forEach((option) => {
    command.option(option.title, option.description, option.default)
  })
})

command.process().catch(function(error) {
  if (error && error.name === 'CLIError') {
    console.error('Error:', error.message)
  } else {
    console.error(error)
  }
  process.exitCode = 1
})
