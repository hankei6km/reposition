import { Readable, Writable } from 'node:stream'
import { reposition, Client } from './index.js'

type Opts = {
  apiKey: string
  databaseId: string
  filterTimeRange: number
  workersNum: number
  stdin: Readable
  stdout: Writable
  stderr: Writable
}

export const cli = async ({
  apiKey,
  databaseId,
  filterTimeRange,
  workersNum,
  stdin,
  stdout,
  stderr
}: Opts): Promise<number> => {
  try {
    const client = new Client({ auth: apiKey })
    await reposition({
      client,
      databaseId,
      filterTimeRange,
      workersNum,
      input: stdin,
      output: stdout
    })
  } catch (err: any) {
    stderr.write(err.toString())
    stderr.write('\n')
    return 1
  }
  return 0
}
