import chalk from 'chalk';
import { validParameter, logError } from '../util';
import prompt from 'prompt'
import Mustache from 'mustache';
import fs from 'fs';


function renderFile(args, globalArgs, prompt_result, from_file) {
    let content = fs.readFileSync(from_file, 'utf8');

    if (!content) throw new Error('File not found')

    let obj_args = getArgsFromObject(args, prompt_result);

    // RENDER final file
    return Mustache.render(content, Object.assign(obj_args, globalArgs) || {});
}

function getArgsFromObject(args, objectToGetArg) {
    return args.reduce((ant, prox) => {
        let object_to_assign = {};
        object_to_assign[prox] = objectToGetArg[prox];

        return Object.assign(ant, object_to_assign);
    }, {});
}

function getTransport(config, transport, globalArgs) {
    return new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(transport.args, function (err, result) {
            let base_dir = `${process.cwd()}${config.base_dir}`;
            let from_file = `${base_dir}${transport.from}`;
            let to_file = `${base_dir}${transport.to}`;

            // render file name with mustache js
            let argsToParseView = getArgsFromObject(transport.args, result);
            let argsViewWithGlobal = Object.assign(argsToParseView, globalArgs);
            let to_file_rendered = Mustache.render(to_file, argsViewWithGlobal || {});

            // render final file
            let rendered_file = renderFile(transport.args, globalArgs, result, from_file)

            fs.writeFile(to_file_rendered, rendered_file, { flag: 'wx' }, (err) => {
                if (err) throw new Error(`Path > ${to_file_rendered} < not found`);
                resolve();
            });

        });
    });
}

function getGlobalArgs(command_select) {
    let globalCommandArgs = command_select.args;

    if (globalCommandArgs && globalCommandArgs.length > 0) console.log(chalk.magenta('set GLOBAL args: '))

    return new Promise((resolve, reject) => {
        prompt.start();
        prompt.get(globalCommandArgs, function (err, result) {
            resolve(getArgsFromObject(globalCommandArgs, result));
        });
    })
}

async function init(config, command) {
    let errorsBaseConfig = validParameter(config, ['base_dir', 'commands']);

    if (errorsBaseConfig && errorsBaseConfig.length > 0) {
        return errorsBaseConfig.forEach(error => logError(`Not found parameter ${error}`));
    };

    let command_select = config.commands[command];
    if (!command_select) return logError(`Not found command > ${command} <`);

    //load global args COMMAND
    let globalArgs = await getGlobalArgs(command_select);

    // INIT
    for (let transport of command_select.transport) {
        let errorParametersTransport = validParameter(transport, ['from', 'to', 'args']);

        if (errorParametersTransport && errorParametersTransport.length > 0) {
            return errorParametersTransport.forEach(error => logError(`Not found parameter ${error}`));
        };



        console.log(chalk.magenta(`process: ${transport.from}`));
        await getTransport(config, transport, globalArgs);
    }

    console.log(chalk.green("Success!"));
}


export default init