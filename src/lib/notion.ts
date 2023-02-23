import type {
  CreatePageParameters,
  UpdatePageParameters
} from '@notionhq/client/build/src/api-endpoints.js'
import type { Client } from './client.js'
import type { RepoItem } from './repo.js'

export function pageParams(repo: RepoItem): {
  cover: CreatePageParameters['cover'] & UpdatePageParameters['cover']
  properties: CreatePageParameters['properties'] &
    UpdatePageParameters['properties']
} {
  const cover: CreatePageParameters['cover'] & UpdatePageParameters['cover'] = {
    external: { url: repo.openGraphImageUrl },
    type: 'external'
  }
  const properties: CreatePageParameters['properties'] &
    UpdatePageParameters['properties'] = {
    createdAt: {
      date: {
        start: repo.createdAt
      }
    },
    description: {
      rich_text: [
        {
          type: 'text',
          text: { content: repo.description }
        }
      ]
    },
    title: {
      title: [{ type: 'text', text: { content: repo.nameWithOwner } }]
    },
    //openGraphImageUrl: {
    //  files: [
    //    {
    //      external: {
    //        url: repo.openGraphImageUrl // Notion 側で画像と認識してもらうには？(ファイル名の拡張子で決まる？)
    //      },
    //      type: 'external',
    //      name: 'ogp.jpg'
    //    }
    //  ]
    //},
    repositoryTopics: {
      multi_select: (repo.repositoryTopics || []).map(({ name }) => ({ name }))
    },
    updatedAt: {
      date: { start: repo.updatedAt }
    },
    url: {
      url: repo.url
    }
  }
  return { cover, properties }
}

export async function send(client: Client, databaseId: string, repo: RepoItem) {
  const response = await client.databases
    .query({
      database_id: databaseId,
      filter: {
        property: 'name',
        title: {
          equals: repo.nameWithOwner
        }
      }
    })
    .catch((err) => {
      throw new Error(`send: query: ${err.message}`)
    })
  if (response.results.length > 0) {
    //console.log(response.results[0])
    await client.pages
      .update({
        page_id: response.results[0].id,
        ...pageParams(repo)
      })
      .catch((err) => {
        throw new Error(`send: update: ${err.message}`)
      })
    return
  }
  await client.pages
    .create({
      parent: { database_id: databaseId },
      ...pageParams(repo)
    })
    .catch((err) => {
      throw new Error(`send: create: ${err.message}`)
    })
}
