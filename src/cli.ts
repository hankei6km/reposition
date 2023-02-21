import { Readable, Writable } from 'node:stream'
import { reposition } from './index.js'

type Opts = {
  stdin: Readable
  stdout: Writable
  stderr: Writable
}

export const cli = async ({ stdin, stdout, stderr }: Opts): Promise<number> => {
  try {
    await reposition(stdin, stdout)
  } catch (err: any) {
    stderr.write(err.toString())
    stderr.write('\n')
    return 1
  }
  return 0
}
