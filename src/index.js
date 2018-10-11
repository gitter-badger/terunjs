#!/usr/bin/env node

import program from './commander';
import readconfig from './reader-config';
import make from './commands/make';
import loading from 'loading-cli';
import chalk from 'chalk';

const load = loading("Carregando configuração").start();

setTimeout(() => {
    load.stop()

    let env = (program.args.length > 0) ? program.make : 'default';

    let command = (program.args.length === 0) ? program.make : program.args[0];
    if (!command) return console.log(chalk.red(`Command not defined`))

    let config = readconfig.getConfig(env);
    if (!config) return console.log(chalk.red(`Config > terun.${env}.json < not found`))

    if (program["make"]) {
        let maker = new make(config, command);
        maker.init();
    }
}, 1000)




