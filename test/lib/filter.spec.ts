import { Filter } from '../../src/lib/filter.js'
import type { RepoItem } from '../../src/lib/repo.js'

describe('Filter.do', () => {
  const getMockData = (pushedAt: string, updatedAt: string): RepoItem => {
    return {
      createdAt: '2022-02-05T14:16:25Z',
      description: '',
      isPrivate: false,
      name: 'aaaaa',
      nameWithOwner: 'hankei6km/aaaaa',
      openGraphImageUrl:
        'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru',
      owner: {
        id: 'abc123',
        login: 'hankei6km'
      },
      repositoryTopics: null,
      pushedAt,
      updatedAt,
      url: 'https://github.com/hankei6km/aaaaa'
    }
  }

  it('should return true(filter-time-rage = 0)', () => {
    const filter = new Filter({
      now: new Date('2023-02-23T13:55:00Z').getTime(),
      filterTimeRange: 0
    })
    expect(
      filter.do(getMockData('2022-02-23T13:55:00Z', '2022-02-23T13:55:00Z'))
    ).toBeTruthy()
  })

  it('should return true(pushedAt is included range)', () => {
    const filter = new Filter({
      now: new Date('2023-02-23T13:55:00Z').getTime(),
      filterTimeRange: 172800 //2days
    })
    expect(
      filter.do(getMockData('2023-02-22T13:55:00Z', '2022-02-23T13:55:00Z'))
    ).toBeTruthy()
  })

  it('should return true(updatedAt is included range)', () => {
    const filter = new Filter({
      now: new Date('2023-02-23T13:55:00Z').getTime(),
      filterTimeRange: 172800 //2days
    })
    expect(
      filter.do(getMockData('2022-02-23T13:55:00Z', '2023-02-22T13:55:00Z'))
    ).toBeTruthy()
  })

  it('should return false', () => {
    const filter = new Filter({
      now: new Date('2023-02-23T13:55:00Z').getTime(),
      filterTimeRange: 172800 //2days
    })
    expect(
      filter.do(getMockData('2022-02-23T13:55:00Z', '2022-02-23T13:55:00Z'))
    ).toBeFalsy()
  })
})
