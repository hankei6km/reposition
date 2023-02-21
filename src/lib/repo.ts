export type RepoItem = {
  createdAt: string
  description: string
  nameWithOwner: string
  openGraphImageUrl: string
  repositoryTopics: Record<'name', string>[] | null
  updatedAt: string
  url: string
}
