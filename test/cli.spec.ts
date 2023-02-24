import { jest } from '@jest/globals'
import { PassThrough, Readable } from 'node:stream'
import type { reposition } from '../src/lib/reposition.js'
// import { cli } from '../src/cli.js'

jest.unstable_mockModule('../src/lib/client.js', async () => {
  const mockClient = jest.fn()
  const dummyInstance = { dummy: 'dummy' }
  const reset = () => {
    mockClient.mockReset().mockImplementation(() => {
      return dummyInstance
    })
  }
  reset()
  return {
    Client: mockClient,
    _reset: reset,
    _getMocks: () => ({
      mockClient,
      dummyInstance
    })
  }
})
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
const mockClient = await import('../src/lib/client.js')
const mockReposition = await import('../src/lib/reposition.js')

const { Client } = await import('../src/lib/client.js')
const { cli } = await import('../src/cli.js')

describe('cli', () => {
  afterEach(() => {
    ;(mockClient as any)._reset()
    ;(mockReposition as any)._reset()
  })
  const apiKey: any = 'test-api-key'
  const databaseId = 'test-database-id'
  const filterTimeRange = 0
  const workersNum = 1
  it('should run normally', async () => {
    const stdin: any = 'dummy-stdin'
    const stdout = new PassThrough()
    const stderr = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    let errData = ''
    stderr.on('data', (d) => (errData = errData + d))

    await cli({
      apiKey,
      databaseId,
      filterTimeRange,
      workersNum,
      stdin,
      stdout,
      stderr
    })

    const { mockClient: mockClientFn, dummyInstance } = (
      mockClient as any
    )._getMocks()
    expect(mockClientFn).toBeCalledWith({ auth: apiKey })
    const { mockReposition: mockRepositionFn } = (
      mockReposition as any
    )._getMocks()
    expect(mockRepositionFn).toBeCalledWith({
      client: dummyInstance,
      databaseId,
      filterTimeRange,
      workersNum,
      input: stdin,
      output: stdout
    })
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

    await cli({
      apiKey,
      databaseId,
      filterTimeRange,
      workersNum,
      stdin,
      stdout,
      stderr
    })

    const { dummyInstance } = (mockClient as any)._getMocks()
    const mock = (mockReposition as any)._getMocks()
    expect(mock.mockReposition).toBeCalledWith({
      client: dummyInstance,
      databaseId,
      filterTimeRange,
      workersNum,
      input: stdin,
      output: stdout
    })
    expect(outData).toEqual('')
    expect(errData).toEqual('dummy-error\n')
  })
})
