# reposition

`reposition` is a command line tool to send a repository list to Notion database.

## Requirement

- GitHub CLI with authenticated to GitHub
- Notion Database
- Notion Integration

## Install

```diff
npm install -g @hankei6km/reposition
```

## Setup

Create a database with following properties in Notion workspace.

| name               | type           |
| ------------------ | -------------- |
| `title`            | `title`        |
| `isPrivate`        | `checkbox`     |
| `name`             | `text`         |
| `owner`            | `text`         |
| `url`              | `url`          |
| `description`      | `text`         |
| `repositoryTopics` | `multi_select` |
| `createdAt`        | `date`         |
| `updatedAt`        | `date`         |
| `pushedAt`         | `date`         |

## Usage

```bash
$ export REPOSITION_API_KEY=<Integration API KEY>
$ export REPOSITION_DATABASE_ID=<Database Id>
$ gh repo list \
  --json nameWithOwner,isPrivate,name,owner,url,description,repositoryTopics,createdAt,updatedAt,pushedAt,openGraphImageUrl \
  --jq .[] | reposition
```

Add `-L` option to `gh` if you hava many repositories.

```bash
$ gh repo list -L 50 \
  --json nameWithOwner,isPrivate,name,owner,url,description,repositoryTopics,createdAt,updatedAt,pushedAt,openGraphImageUrl \
  --jq .[] | reposition
```

When updating the database, use the `--filter-time-range` option to reduce the number of repositories to be send.

```bash
$ gh repo list -L 50 \
  --json nameWithOwner,isPrivate,name,owner,url,description,repositoryTopics,createdAt,updatedAt,pushedAt,openGraphImageUrl \
  --jq .[] | reposition --filter-time-range 172800 # repositories updated(pushed) within 2 days.
```

Note: `reposition` does not have the function to remove pages from the database.

## License

MIT License

Copyright (c) 2023 hankei6km
