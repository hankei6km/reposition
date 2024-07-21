import { getMockClient } from '../util.js'
import { pageParams, send } from '../../src/lib/notion.js'

describe('pageParams', () => {
  it('should return params from a repo', () => {
    expect(
      pageParams({
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
        url: 'https://github.com/hankei6km/aaaaa',
        isPrivate: false
      })
    ).toEqual({
      cover: {
        external: {
          url: 'https://opengraph.githubassets.com/8a871d34480686c2e48e3dd1252aa8239e6564ed851beb3c77f174b138afea4c/hankei6km/gas-feed2notion'
        },
        type: 'external'
      },
      properties: {
        createdAt: {
          date: {
            start: '2022-04-11T07:40:07Z'
          }
        },
        description: {
          rich_text: [
            {
              type: 'text',
              text: {
                content:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
              }
            }
          ]
        },
        name: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'aaaaa'
              }
            }
          ]
        },
        title: {
          title: [{ type: 'text', text: { content: 'hankei6km/aaaaa' } }]
        },
        owner: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'hankei6km'
              }
            }
          ]
        },
        repositoryTopics: {
          multi_select: [
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
          ]
        },
        pushedAt: {
          date: { start: '2023-02-08T08:10:47Z' }
        },
        updatedAt: {
          date: { start: '2023-02-08T08:10:47Z' }
        },
        url: {
          url: 'https://github.com/hankei6km/aaaaa'
        },
        isPrivate: {
          checkbox: false
        }
      }
    })

    expect(
      pageParams({
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
        url: 'https://github.com/hankei6km/aaaaa',
        isPrivate: true
      })
    ).toEqual({
      cover: {
        external: {
          url: 'https://opengraph.githubassets.com/0e9a92dd721c4e6cb2b82df96a66133ac93d43c4233159c1d1c3d1bc420a4fd2/hankei6km/chanpuru'
        },
        type: 'external'
      },
      properties: {
        createdAt: {
          date: {
            start: '2022-02-05T14:16:25Z'
          }
        },
        description: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: ''
              }
            }
          ]
        },
        name: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'aaaaa'
              }
            }
          ]
        },
        title: {
          title: [{ type: 'text', text: { content: 'hankei6km/aaaaa' } }]
        },
        owner: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'hankei6km'
              }
            }
          ]
        },
        repositoryTopics: {
          multi_select: []
        },
        pushedAt: {
          date: { start: '2022-02-23T13:55:00Z' }
        },
        updatedAt: {
          date: { start: '2022-02-23T13:55:00Z' }
        },
        url: {
          url: 'https://github.com/hankei6km/aaaaa'
        },
        isPrivate: {
          checkbox: true
        }
      }
    })
  })
})

describe('send', () => {
  const databaseId = 'test-database-id'
  const repo = {
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
    url: 'https://github.com/hankei6km/aaaaa',
    isPrivate: false
  }

  it('should create a page', async () => {
    const mockClient = getMockClient([])
    await send(mockClient, databaseId, repo)

    expect(mockClient.databases.query).toBeCalledWith({
      database_id: databaseId,
      filter: {
        property: 'title',
        title: {
          equals: repo.nameWithOwner
        }
      }
    })
    expect(mockClient.pages.create).toBeCalledWith({
      parent: { database_id: databaseId },
      ...pageParams(repo)
    })
    expect(mockClient.pages.update).toBeCalledTimes(0)
  })

  it('should update a page', async () => {
    const pageId = 'test-page-id'
    const mockClient = getMockClient([{ id: pageId }])
    await send(mockClient, databaseId, repo)

    expect(mockClient.databases.query).toBeCalledWith({
      database_id: databaseId,
      filter: {
        property: 'title',
        title: {
          equals: repo.nameWithOwner
        }
      }
    })
    expect(mockClient.pages.create).toBeCalledTimes(0)
    expect(mockClient.pages.update).toBeCalledWith({
      page_id: pageId,
      ...pageParams(repo)
    })
  })

  it('should throw error(query)', async () => {
    const pageId = 'test-page-id'
    const mockClient = getMockClient([], {
      query: new Error('test-error-in-query')
    })
    await expect(send(mockClient, databaseId, repo)).rejects.toThrowError(
      'send: query: test-error-in-query'
    )

    expect(mockClient.pages.create).toBeCalledTimes(0)
    expect(mockClient.pages.update).toBeCalledTimes(0)
  })

  it('should throw error(create)', async () => {
    const pageId = 'test-page-id'
    const mockClient = getMockClient([], {
      create: new Error('test-error-in-create')
    })
    await expect(send(mockClient, databaseId, repo)).rejects.toThrowError(
      'send: create: test-error-in-create'
    )

    expect(mockClient.pages.update).toBeCalledTimes(0)
  })

  it('should throw error(update)', async () => {
    const pageId = 'test-page-id'
    const mockClient = getMockClient([{ id: pageId }], {
      update: new Error('test-error-in-update')
    })
    await expect(send(mockClient, databaseId, repo)).rejects.toThrowError(
      'send: update: test-error-in-update'
    )

    expect(mockClient.pages.create).toBeCalledTimes(0)
  })
})
