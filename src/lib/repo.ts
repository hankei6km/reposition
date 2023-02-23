export type RepoItem = {
  createdAt: string
  description: string
  nameWithOwner: string
  name: string
  openGraphImageUrl: string
  owner: { login: string; id?: string }
  pushedAt: string
  repositoryTopics: Record<'name', string>[] | null
  updatedAt: string
  url: string
}
