import { jest } from '@jest/globals'
import { PassThrough, Readable } from 'node:stream'
import type { reposition } from '../src/lib/reposition.js'
// import { cli } from '../src/cli.js'

jest.unstable_mockModule('../src/lib/reposition.js', async () => {
  const mockReposition = jest.fn<typeof reposition>()
  const reset = (err?: any) => {
    if (err) {
      mockReposition.mockReset().mockRejectedValue(err)
    } else {
      mockReposition.mockReset().mockResolvedValue()
    }
  }
  reset()
  return {
    reposition: mockReposition,
    _reset: reset,
    _getMocks: () => ({
      mockReposition
    })
  }
})
const mockReposition = await import('../src/lib/reposition.js')

const { cli } = await import('../src/cli.js')

describe('cli', () => {
  afterEach(() => {
    ;(mockReposition as any)._reset()
  })
  it('should run normally', async () => {
    const stdin: any = 'dummy-stdin'
    const stdout = new PassThrough()
    const stderr = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    let errData = ''
    stderr.on('data', (d) => (errData = errData + d))

    await cli({ stdin, stdout, stderr })

    const mock = (mockReposition as any)._getMocks()
    expect(mock.mockReposition).toBeCalledWith(stdin, stdout)
    expect(outData).toEqual('')
    expect(errData).toEqual('')
  })
  it('should print error', async () => {
    const stdin: any = 'dummy-stdin'
    const stdout = new PassThrough()
    const stderr = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    let errData = ''
    stderr.on('data', (d) => (errData = errData + d))
    ;(mockReposition as any)._reset('dummy-error')

    await cli({ stdin, stdout, stderr })

    const mock = (mockReposition as any)._getMocks()
    expect(mock.mockReposition).toBeCalledWith(stdin, stdout)
    expect(outData).toEqual('')
    expect(errData).toEqual('dummy-error\n')
  })
})
