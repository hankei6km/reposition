import type { RepoItem } from './repo'

export type FilterOpts = {
  now: number
  filterTimeRange: number
}

export class Filter {
  opts!: FilterOpts
  nowSec!: number
  constructor(opts: FilterOpts) {
    this.opts = Object.assign({}, opts)
    this.nowSec = this.opts.now / 1000
  }
  do(repo: RepoItem): boolean {
    if (this.opts.filterTimeRange === 0) {
      return true
    }
    const updatedAt = new Date(repo.updatedAt).getTime() / 1000
    const pushedAt = new Date(repo.pushedAt).getTime() / 1000
    if (
      this.nowSec - updatedAt < this.opts.filterTimeRange ||
      this.nowSec - pushedAt < this.opts.filterTimeRange
    ) {
      return true
    }
    return false
  }
}
