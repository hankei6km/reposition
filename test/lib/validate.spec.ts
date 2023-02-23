import { validateRepoItem } from '../../src/lib/validate.js'

describe('validateRepoItem', () => {
  it('should pass valid items', () => {
    expect(
      validateRepoItem({
        createdAt: '2022-04-11T07:40:07Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          'https://opengraph.githubassets.com/8a871d34480686c2e48e3dd1252aa8239e6564ed851beb3c77f174b138afea4c/hankei6km/gas-feed2notion',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        repositoryTopics: [
          {
            name: 'google-apps-script'
          },
          {
            name: 'notion'
          },
          {
            name: 'notion-api'
          },
          {
            name: 'notion-database'
          },
          {
            name: 'typescript'
          }
        ],
        pushedAt: '2023-02-08T08:10:47Z',
        updatedAt: '2023-02-08T08:10:47Z',
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ).toBeTruthy()
    expect(
      validateRepoItem({
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
      })
    ).toBeTruthy()
  })

  it('should throw errors', () => {
    expect(() =>
      validateRepoItem({
        createdAt: 'invalid date',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          '<https://opengraph.githubassets.com/8a871d34480686c2e48e3dd1252aa8239e6564ed851beb3c77f174b138afea4c/hankei6km/gas-feed2notion>',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        repositoryTopics: {
          name: 'invalid topic'
        },
        pushedAt: '2023-02-08T08:10:47Z',
        updatedAt: '2023-02-08T08:10:47Z',
        url: 'https://github.com/hankei6km/aaaaa'
      })
    ).toThrowError('Validate Repo Item: must match format "date-time"')
    expect(() =>
      validateRepoItem({
        createdAt: '2022-04-11T07:40:07Z',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        name: 'aaaaa',
        nameWithOwner: 'hankei6km/aaaaa',
        openGraphImageUrl:
          '<https://opengraph.githubassets.com/8a871d34480686c2e48e3dd1252aa8239e6564ed851beb3c77f174b138afea4c/hankei6km/gas-feed2notion>',
        owner: {
          id: 'abc123',
          login: 'hankei6km'
        },
        repositoryTopics: null,
        pushedAt: '2023-02-08T08:10:47Z',
        updatedAt: '2023-02-08T08:10:47Z',
        url: '<https://github.com/hankei6km/aaaa>'
      })
    ).toThrowError('Validate Repo Item: must match format "uri"')
  })
})
