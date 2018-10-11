import chalk from 'chalk';
import { validParameter, logError } from '../util';
import prompt from 'prompt'
import Mustache from 'mustache';
import fs from 'fs';

import PluginFunctions from '../plugins/functions';
import { SymfonyEntityForm } from '../plugins/symfony';

class Make {
    constructor(config, command) {
        this.config = config;
        this.command = command;
        this.transport_files = [];
        this.global_args = {};
        this.plugins = {
            functions: new PluginFunctions(),
            "symfony:entity-form": new SymfonyEntityForm()
        }
    }

    async init() {
        let isValid = this.validInit(this.config, this.command);
        if (!isValid) return;

        let command_select = this.config.commands[this.command];
        //load global args COMMAND
        await this.getGlobalArgs(command_select);
        // get transport
        this.transport_files = command_select.transport;
        for (let transport of this.transport_files) {
            if (!this.validTransport(transport)) return;

            console.log(chalk.magenta(`process: ${transport.from}`));
            await this.getTransport(transport);
        }

        console.log(chalk.green("Success in create files!"));
    }

    renderFile(args_to_render, from_file) {
        let content = fs.readFileSync(from_file, 'utf8');
        if (!content) throw new Error('File not found or file empty')
        console.log(args_to_render);
        // RENDER final file
        return Mustache.render(content, args_to_render || {});
    }

    getTransport(transport) {
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(transport.args, async (err, result) => {
                let base_dir = `${process.cwd()}${this.config.base_dir}`;
                let from_file = `${base_dir}${transport.from}`;
                let to_file = `${base_dir}${transport.to}`;

                // render file name with mustache js
                let argsToParseView = this.getArgsFromObject(transport.args, result);
                let argsToFileNameRender = Object.assign(argsToParseView, this.global_args, this.plugins.functions.functions);
                let to_file_rendered = Mustache.render(to_file, argsToFileNameRender || {});

                // render final file
                let argsToParseViewRender = this.getArgsFromObject(transport.args, result);

                // start plugins transport FIXED SYMFONY HERE
                let plugins = transport.plugins;
                if (plugins) {
                    let symfonyEntityReaderConfig = plugins.find((plugin) => plugin.name == "symfony:entity-form")
                    if (symfonyEntityReaderConfig) {
                        symfonyEntityReaderConfig.from = Mustache.render(symfonyEntityReaderConfig.from, argsToFileNameRender || {});

                        let symfonyEntityReaderPLUGIN = this.plugins["symfony:entity-form"];
                        symfonyEntityReaderPLUGIN.setConfig(symfonyEntityReaderConfig);
                        console.log(symfonyEntityReaderPLUGIN)
                        argsToParseViewRender['symfonyform'] = await symfonyEntityReaderPLUGIN.getForm();
                    }
                }

                let argsToRenderFile = Object.assign(argsToParseViewRender, this.global_args, this.plugins.functions.functions)

                let rendered_file = this.renderFile(argsToRenderFile, from_file)

                console.log(rendered_file);

                fs.writeFile(to_file_rendered, rendered_file, 'utf-8', (err) => {
                    if (err) throw new Error(err);
                    resolve();
                });

            });
        });
    }

    getGlobalArgs(command_select) {
        let globalCommandArgs = command_select.args;
        if (globalCommandArgs && globalCommandArgs.length > 0) console.log(chalk.magenta('set GLOBAL args: '))

        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(globalCommandArgs, (err, result) => {
                this.global_args = this.getArgsFromObject(globalCommandArgs, result);
                resolve();
            });
        })
    }

    getArgsFromObject(args, objectToGetArg) {
        return args.reduce((ant, prox) => {
            let object_to_assign = {};
            object_to_assign[prox] = objectToGetArg[prox];

            return Object.assign(ant, object_to_assign);
        }, {});
    }

    validInit(config, command) {
        let errorsBaseConfig = validParameter(config, ['base_dir', 'commands']);
        let isValid = true;

        if (errorsBaseConfig && errorsBaseConfig.length > 0) {
            isValid = false;
            return errorsBaseConfig.forEach(error => logError(`Not found parameter ${error}`));
        };

        let command_select = config.commands[command];
        if (!command_select) {
            isValid = false;
            return logError(`Not found command > ${command} <`);
        }

        return isValid;
    }

    validTransport(transport) {
        let errorParametersTransport = validParameter(transport, ['from', 'to', 'args']);
        let isValid = true;
        if (errorParametersTransport && errorParametersTransport.length > 0) {
            isValid = false;
            return errorParametersTransport.forEach(error => logError(`Not found parameter ${error}`));
        };

        return isValid;
    }
}
// Utils
export default Make;