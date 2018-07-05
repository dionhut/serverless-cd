#!/usr/bin/env node

import program from 'commander';
import yargs from 'yargs'
import {FunctionCommands} from './FunctionCommands';

yargs.command("promote-function <name>", 'Promote function', {
    'to-alias': {
        type: 'string',
        describe: 'To Alias'
    },
    'from-alias': {
        type: 'string',
        describe: 'From Alias'
    }
}, argv => {
    (async () => {
        let functionCommands = new FunctionCommands();
        try {
            await functionCommands.promoteFunction(argv.name, argv.fromAlias, argv.toAlias);
        } catch(error) {
            console.error(error);
        }
    })().then();
})
.help()
.argv
