#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { cli } from './cli.js'

const envVarsPrefix = process.env['REPOSITION_ENV_VARS_PREFIX'] || 'REPOSITION'

;(async () => {
  const argv = await yargs(hideBin(process.argv))
    .scriptName('reposition')
    .env(envVarsPrefix)
    .usage('$0 [OPTIONS]... < repolist.jsonl')
    .demand(0)
    .options({
      'api-key': {
        type: 'string',
        array: false,
        required: true,
        description: 'API Key to API endpoint'
      },
      'database-id': {
        type: 'string',
        array: false,
        required: true,
        description: 'The id of database in Notion'
      },
      'filter-time-range': {
        type: 'number',
        array: false,
        required: false,
        default: 0,
        description:
          'Time range(seconds) to filter repos to send. Send all repos by default'
      }
    })
    .help().argv

  process.exit(
    await cli({
      apiKey: argv['api-key'],
      databaseId: argv['database-id'],
      filterTimeRange: argv['filter-time-range'],
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  )
})()
