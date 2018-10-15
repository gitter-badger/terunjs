#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("./utils/commander"));

var _readerConfig = _interopRequireDefault(require("./utils/reader-config"));

var _make = _interopRequireDefault(require("./commands/make"));

var _loadingCli = _interopRequireDefault(require("loading-cli"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const load = (0, _loadingCli.default)("Carregando configuração").start();
setTimeout(() => {
  load.stop(); // Esta parte vai definir todo contexto da biblioteca
  // qual arquivo deve carregar as configurações e como deve fazer isto

  let env = _commander.default.args.length > 0 ? _commander.default.make : 'default';
  let command = _commander.default.args.length === 0 ? _commander.default.make : _commander.default.args[0];
  if (!command) return console.log(_chalk.default.red(`Command not defined`));

  let config = _readerConfig.default.getConfig(env);

  if (!config) return console.log(_chalk.default.red(`Config > terun.${env}.json < not found`));

  if (_commander.default["make"]) {
    let maker = new _make.default(config, command, config.tags);
    maker.init();
  }
}, 1000);