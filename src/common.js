/* @flow */

import got from 'got'

export class CLIError extends Error {
  name = 'CLIError'
}

export async function getAllPages(url: string): Promise<Array<any>> {
  let i = 1
  const results = []
  const moddedUrl = url.includes('?') ? `${url}&per_page=100` : `${url}?per_page=100`
  for (;;) {
    const response = await got(`${moddedUrl}&page=${i}`, { json: true })
    if (!Array.isArray(response.body) || !response.body.length) {
      break
    }
    results.push(response.body)
    i++
  }

  return results.reduce((total, entry) => total.concat(entry), [])
}
