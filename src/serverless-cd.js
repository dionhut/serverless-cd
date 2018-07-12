#!/usr/bin/env node
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .wrap(120)
  .help()
  .argv
