#!/usr/bin/env node

import program from './utils/commander';
import readconfig from './utils/reader-config';
import make from './commands/make';
import loading from 'loading-cli';
import chalk from 'chalk';
import init from './commands/init';

const load = loading("Carregando configuração").start();

setTimeout(() => {
    load.stop()

    // Esta parte vai definir todo contexto da biblioteca
    // qual arquivo deve carregar as configurações e como deve fazer isto
    if (program["make"]) {
        let env = (program.args.length > 0) ? program.make : 'default';

        let command = (program.args.length === 0) ? program.make : program.args[0];
        if (!command) return console.log(chalk.red(`Command not defined`))

        let config = readconfig.getConfig(env);
        if (!config) return console.log(chalk.red(`Config > terun.${env}.json < not found`))

        let maker = new make(config, command, config.tags).init();
    }

    if (program["init"]) {
        init();
    }
}, 1000)




