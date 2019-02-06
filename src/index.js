#!/usr/bin/env node

import program from './core/commander';
import ConfigManager from './core/configManager';

// Commands
import Make from './commands/make';
import init from './commands/init';

// Libraries
import loading from 'loading-cli';
import chalk from 'chalk';
import ascii from 'ascii-art';
import clear from 'clear';

// Definindo variaveis GLOBAIS

global.config_folder_name = 'config'

const LOAD = loading('Carregando configuração').start();
const LOAD_TIME = 500;

setTimeout(async() => {
	clear();
	console.log(await ascii.font('Terun JS','Doom').toPromise());

	LOAD.stop();

	let env = 'default';

	// define o contexto que será trabalhado
	if(program.env){
		env = program.args[0];
	}

	// Esta parte vai definir todo contexto da biblioteca
	// qual arquivo deve carregar as configurações e como deve fazer isto
	if (program.make) {
		let command = program.make;
		if (!command) return console.log(chalk.red('Command not defined'));

		let config = ConfigManager.getMainConfig(env);
		if (!config) return;

		new Make(config, command, config.tags).init();
	}

	if (program.init) {
		init();
	}
    
}, LOAD_TIME);