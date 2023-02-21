import { PassThrough, Readable } from 'node:stream'
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
  it('should pass valid items', async () => {
    const data = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        repositoryTopics: null,
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      }),
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        repositoryTopics: null,
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ].join('\n')
    const stdin = mockStdin(data) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    await reposition(stdin, stdout)
    expect(outData).toEqual('true\ntrue\n')
  })
  it('should throw errors', async () => {
    const data = [
      JSON.stringify({
        createdAt: '2022-02-05T14:16:25Z',
        description: '',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
        repositoryTopics: null,
        updatedAt: '2022-02-23T13:55:00Z',
        url: 'https://github.com/hankei6km/aaaaa'
      }),
      JSON.stringify({})
    ].join('\n')
    const stdin = mockStdin(data) as unknown as Readable
    const stdout = new PassThrough()
    let outData = ''
    stdout.on('data', (d) => (outData = outData + d))
    expect(reposition(stdin, stdout)).rejects.toThrowError(
      "Validate Repo Item: must have required property 'createdAt'"
    )
  })
})
