/* @flow */

import got from 'got'

export class CLIError extends Error {
  name = 'CLIError'
}

export async function getGHAllPages(url: string): Promise<Array<any>> {
  let i = 1
  const results = []
  const moddedUrl = url.includes('?') ? `${url}&per_page=100` : `${url}?per_page=100`
  const options = { json: true, headers: {} }
  if (process.env.GITHUB_TOKEN) {
    options.headers.authorization = `token ${process.env.GITHUB_TOKEN}`
  }

  for (;;) {
    const response = await got(`${moddedUrl}&page=${i}`, options)
    if (!Array.isArray(response.body) || !response.body.length) {
      break
    }
    results.push(response.body)
    i++
  }

  return results.reduce((total, entry) => total.concat(entry), [])
}
