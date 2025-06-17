import { PassThrough, Readable } from 'node:stream'
import { getMockClient } from '../util.js'
import { reposition } from '../../src/lib/reposition.js'

describe('reposition', () => {
  const mockStdin = (data: string) => {
    let offset = 0
    const len = data.length
    return new Readable({
      read(size) {
        const end = offset + size
        this.push(data.slice(offset, offset + size))
        if (len < end) {
          this.push(null)
        }
        offset = end
      }
    })
  }
  const databaseId = 'test-database-id'
  it('should pass valid items', async () => {
    const data = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        repositoryTopics: null,
        pushedAt: '2022-02-23T13:55:00Z',
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      }),
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        pushedAt: '2022-02-23T13:55:00Z',
        repositoryTopics: null,
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ]
    const input = data.join('\n')
    const stdin = mockStdin(input) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    const mockClient = getMockClient([])

    await reposition({
      client: mockClient,
      databaseId,
      filterTimeRange: 0,
      workersNum: 1,
      input: stdin,
      output: stdout
    })

    expect(outData).toEqual('')
    expect(mockClient.databases.query).toHaveBeenCalledTimes(data.length)
  })

  it('should drop items by filter', async () => {
    const now = Date.now()
    const data = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        pushedAt: new Date(now).toISOString(),
        repositoryTopics: null,
        updatedAt: new Date(now).toISOString(),
        url: 'https://github.com/hankei6km/aaaaa'
      }),
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        pushedAt: new Date(now - 172801 * 1000).toISOString(),
        repositoryTopics: null,
        updatedAt: new Date(now - 172801 * 1000).toISOString(),
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ]
    const input = data.join('\n')
    const stdin = mockStdin(input) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    const mockClient = getMockClient([])

    await reposition({
      client: mockClient,
      databaseId,
      filterTimeRange: 172800, //2days
      workersNum: 1,
      input: stdin,
      output: stdout
    })

    expect(outData).toEqual('')
    expect(mockClient.databases.query).toHaveBeenCalledTimes(data.length - 1)
  })

  it('should throw errors(invalid data)', async () => {
    const data: any[] = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        repositoryTopics: null,
        updatedAt: '2022-02-23T13:55:00Z',
        pushedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      }),
      JSON.stringify({})
    ]
    const input = data.join('\n')
    const stdin = mockStdin(input) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    const mockClient = getMockClient([])

    await expect(
      reposition({
        client: mockClient,
        databaseId,
        filterTimeRange: 0,
        workersNum: 1,
        input: stdin,
        output: stdout
      })
    ).rejects.toThrow(
      "Validate Repo Item: must have required property 'createdAt'"
    )
  })

  it('should throw errors(error in send)', async () => {
    const data: any[] = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        name: 'hankei6km/aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        repositoryTopics: null,
        pushedAt: '2022-02-23T13:55:00Z',
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ]
    const input = data.join('\n')
    const stdin = mockStdin(input) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    const mockClient = getMockClient([], {
      query: new Error('test-error-in-query')
    })

    await expect(
      reposition({
        client: mockClient,
        databaseId,
        filterTimeRange: 0,
        workersNum: 1,
        input: stdin,
        output: stdout
      })
    ).rejects.toThrow('send: query: test-error-in-query')
  })
})
