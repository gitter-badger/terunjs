#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("./core/commander"));

var _configManager = _interopRequireDefault(require("./core/configManager"));

var _make = _interopRequireDefault(require("./commands/make"));

var _init = _interopRequireDefault(require("./commands/init"));

var _loadingCli = _interopRequireDefault(require("loading-cli"));

var _chalk = _interopRequireDefault(require("chalk"));

var _asciiArt = _interopRequireDefault(require("ascii-art"));

var _clear = _interopRequireDefault(require("clear"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Commands
// Libraries
// Definindo variaveis GLOBAIS
global.config_folder_name = 'config';
const LOAD = (0, _loadingCli.default)('Carregando configuração').start();
setTimeout(async () => {
  (0, _clear.default)();
  console.log((await _asciiArt.default.font('Terun JS', 'Doom').toPromise()));
  LOAD.stop();
  let env = 'default';

  if (_commander.default.env) {
    env = _commander.default.args[0];
  } // Esta parte vai definir todo contexto da biblioteca
  // qual arquivo deve carregar as configurações e como deve fazer isto


  if (_commander.default.make) {
    let command = _commander.default.make;
    if (!command) return console.log(_chalk.default.red('Command not defined'));

    let config = _configManager.default.getMainConfig(env);

    if (!config) return;
    new _make.default(config, command, config.tags).init();
  }

  if (_commander.default.init) {
    (0, _init.default)();
  }
}, 1000);