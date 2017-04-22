/* @flow */

import FS from 'sb-fs'
import Path from 'path'
import invariant from 'assert'
import multimatch from 'multimatch'
import ChildProcess from 'child_process'
import type { Owner, Project } from './types'

export default class Command {
  name = ''
  description = ''

  projectsRoot: string;
  constructor(projectsRoot: string) {
    invariant(projectsRoot && typeof projectsRoot === 'string', 'projectsRoot must be a valid string')

    this.projectsRoot = projectsRoot
  }
  // eslint-disable-next-line no-unused-vars
  callback(...params: any) {
    throw new Error('You must implement a callback() method in your command')
  }
  matchProjects(projects: Array<Project>, queries: Array<string>): Array<Project> {
    return projects.filter(project => multimatch([project.name, `${project.owner}/${project.name}`], queries).length)
  }
  async getOwners(): Promise<Array<Owner>> {
    const owners = []
    const entries = await FS.readdir(this.projectsRoot)
    await Promise.all(entries.map(async (entry) => {
      if (entry.slice(0, 1) === '.') return 1
      const entryPath = Path.join(this.projectsRoot, entry)
      const stat = await FS.lstat(entryPath)
      if (stat.isDirectory()) {
        owners.push({ path: entryPath, name: entry })
      }
      return 1
    }))
    return owners
  }
  async getProjects(givenOwners: ?Array<Owner> = null): Promise<Array<Project>> {
    const owners = givenOwners || await this.getOwners()
    const projects = []
    await Promise.all(owners.map(async (owner) => {
      const entries = await FS.readdir(owner.path)
      return Promise.all(entries.map(async (entry) => {
        if (entry.slice(0, 1) === '.') return 1
        const entryPath = Path.join(owner.path, entry)
        const stat = await FS.lstat(entryPath)
        if (stat.isDirectory()) {
          projects.push({ path: entryPath, name: entry, owner: owner.name })
        }
        return 1
      }))
    }))
    return projects
  }
  async spawn(
    name: string,
    parameters: Array<string>,
    options: Object,
  ): Promise<{ code: number, stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
      const data = { stdout: [], stderr: [] }
      const spawned = ChildProcess.spawn(name, parameters, options)

      if (spawned.stdout) {
        spawned.stdout.on('data', function(chunk) {
          data.stdout.push(chunk)
        })
      }
      if (spawned.stderr) {
        spawned.stderr.on('data', function(chunk) {
          data.stderr.push(chunk)
        })
      }

      spawned.on('exit', (exitCode) => {
        resolve({ code: exitCode, stdout: data.stdout.join('').trim(), stderr: data.stderr.join('').trim() })
      })
      spawned.on('error', reject)
    }).catch(function(error) {
      if (error && typeof error === 'object' && options.cwd) {
        // eslint-disable-next-line no-param-reassign
        error.directory = options.cwd
      }
      throw error
    })
  }
}
