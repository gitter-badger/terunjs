#!/usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _crud = _interopRequireDefault(require("./commands/symfony/crud"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.version('0.0.1').option('-sc, --symfony:crud [entity name]', 'Make a crud based in entity', _crud.default).parse(process.argv);