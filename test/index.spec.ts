import * as index from '../src/index.js'
import { reposition } from '../src/lib/reposition.js'

describe('index.ts', () => {
  it('should export modules', async () => {
    expect(index.reposition).toEqual(reposition)
  })
})
