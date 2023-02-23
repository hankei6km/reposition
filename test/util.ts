import { jest } from '@jest/globals'
import type { Client } from '../src/lib/client.js'

export function getMockClient(
  results: any[],
  err: { query?: Error; create?: Error; update?: Error } = {}
): Client {
  let query = jest.fn<(params: any) => Promise<{ results: any[] }>>()
  query = err.query
    ? query.mockRejectedValue(err.query)
    : query.mockResolvedValue({ results })
  let create = jest.fn<(params: any) => Promise<{}>>()
  create = err.create
    ? create.mockRejectedValue(err.create)
    : create.mockResolvedValue({})
  let update = jest.fn<(params: any) => Promise<{}>>()
  update = err.update
    ? update.mockRejectedValue(err.update)
    : update.mockResolvedValue({})
  return {
    databases: {
      query
    },
    pages: {
      create,
      update
    }
  } as any as Client
}
