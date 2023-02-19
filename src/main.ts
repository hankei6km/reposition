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
    .options({})
    .help().argv

  process.exit(
    await cli({
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  )
})()
