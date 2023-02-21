import Ajv, { DefinedError } from 'ajv'
import addFormats from 'ajv-formats'
import { RepoItem } from './repo.js'

const ajv = new Ajv()
addFormats(ajv)

//export const RepoItemSchema: JSONSchemaType<RepoItem> = {
export const RepoItemSchema = {
  type: 'object',
  required: [
    'createdAt',
    'nameWithOwner',
    'openGraphImageUrl',
    'updatedAt',
    'url'
  ],
  properties: {
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    description: {
      type: 'string'
    },
    nameWithOwner: {
      type: 'string'
    },
    openGraphImageUrl: {
      type: 'string',
      format: 'uri'
    },
    repositoryTopics: {
      type: ['array', 'null'],
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    },
    updatedAt: {
      type: 'string',
      format: 'date-time'
    },
    url: {
      type: 'string',
      format: 'uri'
    }
  }
}
const validate = ajv.compile(RepoItemSchema)

export function validateRepoItem(repo: Record<string, any>): repo is RepoItem {
  if (validate(repo)) {
    return true
  }
  const msg = (validate.errors as DefinedError[])
    .filter((err) => typeof err.message === 'string')
    .map(({ message }) => message)
    .join(',')
  // repo 名を出すのは?
  throw new Error(`Validate Repo Item: ${msg}`)
}
