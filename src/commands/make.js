import chalk from 'chalk';
import { validParameter, logError, dropFileName } from '../utils/util';
import prompt from 'prompt'
import Render from '../utils/render';
import fs from 'fs';
import fx from 'mkdir-recursive';
import Plugin from '../plugins';

class Make {
    constructor(config, command, tag_custom) {
        this.config = config;
        this.command = command;
        this.transport_files = [];
        this.global_args = {};
        this.render = new Render(tag_custom);
        this.plugins = new Plugin(this.render);
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

    async createDir(to) {
        let dirToCreate = `${dropFileName(to)}`;
        return await fx.mkdirSync(dirToCreate);
    }

    getTransport(transport) {
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(transport.args, async (err, result) => {
                this.plugins.init(transport.plugins);

                let base_dir = `${process.cwd()}${this.config.base_dir}`;
                let from_file = `${base_dir}${transport.from}`;
                let to_file = `${base_dir}${transport.to}`;

                // render file name with mustache js
                let argsToParseView = this.getArgsFromObject(transport.args, result);
                let argsToFileNameRender = Object.assign(argsToParseView, this.global_args);
                let to_file_rendered = this.render.renderSimple(to_file, argsToFileNameRender);

                // render final file ARGS
                let argsToParseViewRender = this.getArgsFromObject(transport.args, result);

                await this.plugins.config(argsToFileNameRender);
                argsToParseViewRender = await this.plugins.beforeRender(argsToParseViewRender);

                let argsToRenderFinalFile = Object.assign(argsToParseViewRender, this.global_args)
                let rendered_file = this.render.renderFile(from_file, argsToRenderFinalFile)

                await this.createDir(to_file_rendered)
                    .catch(err => {
                        console.log(chalk.red('Error on create folder'))
                        throw new Error(err);
                    });

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