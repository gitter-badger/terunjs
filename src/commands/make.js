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

        //load global args COMMAND and config plugins
        await this.getGlobalArgs(command_select.args || []);
        this.plugins.init(command_select.plugins);
        await this.plugins.config(this.global_args);
        
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
                if(err) throw new Error(err);

                // PATHS
                let baseDirPath = `${process.cwd()}${this.config.base_dir}`;
                let fromFilePath = `${baseDirPath}${transport.from}`;
                let toFilePath = `${baseDirPath}${transport.to}`;

                // render final file ARGS
                let argsToRenderInFile = this.getArgsFromObject(transport.args, result);

                // life cycle before render
                argsToRenderInFile = await this.plugins.beforeRender(argsToRenderInFile);

                // render file name with mustache js
                let argsToParseView = this.getArgsFromObject(transport.args, result);
                let toFileName = this.render.renderSimple(toFilePath, Object.assign(argsToParseView, this.global_args, argsToRenderInFile));

                let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.global_args)

                let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile)

                await this.createDir(toFileName)
                    .catch(err => {
                        console.log(chalk.red('Error on create folder'))
                        throw new Error(err);
                    });

                fs.writeFile(toFileName, fileRendered, 'utf-8', (err) => {
                    if (err) throw new Error(err);
                    resolve();
                });
            });
        });
    }

    getGlobalArgs(commandSelectedArgs) {
        if (commandSelectedArgs.length > 0) console.log(chalk.magenta('set GLOBAL args: '))

        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get(commandSelectedArgs, (err, result) => {
                this.global_args = this.getArgsFromObject(commandSelectedArgs, result);
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