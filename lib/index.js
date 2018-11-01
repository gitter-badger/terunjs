#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("./utils/commander"));

var _readerConfig = _interopRequireDefault(require("./utils/reader-config"));

var _make = _interopRequireDefault(require("./commands/make"));

var _loadingCli = _interopRequireDefault(require("loading-cli"));

var _chalk = _interopRequireDefault(require("chalk"));

var _init = _interopRequireDefault(require("./commands/init"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOAD = (0, _loadingCli.default)('Carregando configuração').start();
setTimeout(() => {
  LOAD.stop();
  let env = 'default';

  if (_commander.default.env) {
    env = _commander.default.args[0];
  } // Esta parte vai definir todo contexto da biblioteca
  // qual arquivo deve carregar as configurações e como deve fazer isto


  if (_commander.default.make) {
    let command = _commander.default.make;
    if (!command) return console.log(_chalk.default.red('Command not defined'));

    let config = _readerConfig.default.getConfig(env);

    if (!config) return console.log(_chalk.default.red(`Config > terun.${env}.json < not found`));
    new _make.default(config, command, config.tags).init();
  }

  if (_commander.default.init) {
    (0, _init.default)();
  }
}, 1000);