import { Readable, Writable } from 'node:stream'
import util from 'node:util'
import type { Client } from '@notionhq/client'
import { parse } from 'ndjson'
import { Chan } from 'chanpuru'
import { validateRepoItem } from './validate.js'
import { send } from './notion.js'
import { Filter } from './filter.js'

export type RepositionOpts = {
  client: Client
  databaseId: string
  filterTimeRange: number
  input: Readable
  output: Writable
}

export async function reposition({
  client,
  databaseId,
  filterTimeRange,
  input,
  output
}: RepositionOpts) {
  const jsonStream = input.pipe(parse())
  const ch = new Chan<Promise<void>>(3, { rejectInReceiver: true })
  let err: Error | null = null
  const filter = new Filter({ now: Date.now(), filterTimeRange })
  const LogWrite: (chunk: any, encoding?: BufferEncoding) => Promise<any> =
    util.promisify(output.write.bind(output))

  ;(async () => {
    try {
      for await (const data of jsonStream) {
        const p = (async (data: any) => {
          if (validateRepoItem(data) && filter.do(data)) {
            await send(client, databaseId, data)
          }
        })(data)
        await ch.send(p)
      }
    } catch (e: any) {
      // rejectInReceiver を設定しているから、ここで catch はほぼない、かな.
      err = e
    } finally {
      ch.close()
    }
  })()

  // ite を回しているときに validate などから reject されるようにしてある.
  // errCh 作るか検討.
  for await (const i of ch.receiver()) {
  }

  if (err) {
    throw err
  }
}
