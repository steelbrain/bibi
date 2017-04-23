/* @flow */

export type Project = {
  name: string,
  slug: string,
  path: string,
  owner: string,
}

export type Owner = {
  name: string,
  path: string,
}

export type Task = {
  title: string,
  callback: ((
    context: Object,
    task: {
      skip: ((reason: string) => void),
    },
  ) => any),
}

export type TaskOptions = {
  concurrent?: boolean,
}
