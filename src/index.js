#!/usr/bin/env node

import program from 'commander';
import symfonyCrud from './commands/symfony/crud';

program
    .version('0.0.1')
    .option('-sc, --symfony:crud [entity name]', 'Make a crud based in entity', symfonyCrud)
    .parse(process.argv);

