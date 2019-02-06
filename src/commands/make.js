import chalk from 'chalk';
import fs from 'fs';
import prompt from 'prompt';
import promptBox from 'prompt-checkbox'
import Plugin from '../plugins';
import Render from '../core/render';
import TransportManager from '../core/transport';
import { logError, getMissingProperties, createDir } from '../utils/util';

class Make {
	constructor(config, command, tag_custom) {
		this.config = config;
		this.command = command;
		this.transportManager = new TransportManager();
		this.globalArgs = {};
		this.render = new Render(tag_custom);
		this.plugins = new Plugin(this.render);
	}

	async init() {
		let commandSelected = this.config.commands[this.command];

		if(!commandSelected){
			console.log(chalk.yellow(`Command >${this.command}< not found. See your terun.config.js`));
			return false;
		}

		//load global args COMMAND and config plugins
		this.globalArgs = await this.getGlobalArgs(commandSelected.args || []);
		this.plugins.init(commandSelected.plugins);
		await this.plugins.config(this.globalArgs, this.config, commandSelected.transport);

		// get transport
		this.transportManager.setFiles(commandSelected.transport);
		this.transportManager.setFragmentsFiles(this.config["transport-fragments"]);
		let validTransport = this.transportManager.validateTransportFiles();
		if(!validTransport) return false;

		for (let transport of this.transportManager.transportFiles) {
			console.log(chalk.white.bgGreen.bold(`process: ${transport.from}`));
			await this.initResolveTransport(transport);
		}

		if(this.transportManager.transportFiles.length > 0){
			console.log(chalk.green('Success in create files!'));
			return  true;
		}else{
			console.log(chalk.yellow('Nothing to create!'));
			return false;
		}
	}

	async continueOverrideFile(pathFile){
		let fileExist = fs.existsSync(pathFile);
		let continueOverride = true;

		if(fileExist){
			let continueQuestion = () => {
				let checkbox = new promptBox({
					name: 'continue',
					message: 'File already exists, continue?',
					choices: [
					  'Yes'
					]
				});

				return checkbox.run();
			}
			let continueQuestionAnswer = await continueQuestion()
			continueOverride = continueQuestionAnswer.length;

			if(!continueOverride)
				console.log(chalk.yellow('Relax, you skipped file, nothing to do :)'));
		}

		return continueOverride;
	}

	async initResolveTransport(transport) {
		if(!transport.args){
			transport.args = [];
		}

		await this.plugins.initTransport();

		return new Promise((resolve) => {
			this.resolveTransport(transport, resolve)
		});
	}

	async resolveTransport(transport, doneCallback){
		prompt.start();
		prompt.get(transport.args, async (err, result) => {
			if (err) throw new Error(err);

			// PATHS
			let baseDirPath = `${process.cwd()}/`;
			let fromFilePath = `${baseDirPath}${transport.from}`;
			let toFilePath = `${baseDirPath}${transport.to}`;

			// render final file ARGS
			let argsToRenderInFile = this.getArgsFromObject(transport.args, result);

			// life cycle before render
			argsToRenderInFile = await this.plugins.beforeRender(argsToRenderInFile);

			// render file name with mustache js
			let argsToParseView = this.getArgsFromObject(transport.args, result);
			let toFileName = this.render.renderSimple(toFilePath, Object.assign(argsToParseView, this.globalArgs, argsToRenderInFile));

			let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.globalArgs);
			let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile);


			// Cria os diretorios de forma recursiva.
			await createDir(toFileName).catch(err => {
				console.log(chalk.red('Error on create folder'));
				throw new Error(err);
			});

			let continueOverride = await this.continueOverrideFile(toFileName)

			if(continueOverride)
				fs.writeFile(toFileName, fileRendered, 'utf-8', (err) => {
					if (err) throw new Error(err);
				});

			// Done life
			let done = await this.plugins.doneRender();

			if(done.loop){
				await this.initResolveTransport(transport)
				doneCallback()
			}else{
				doneCallback()
			}
		});
	}

	getGlobalArgs(commandSelectedArgs) {
		if (commandSelectedArgs.length > 0) console.log(chalk.magenta('set GLOBAL args: '));

		return new Promise((resolve, reject) => {
			prompt.start();
			prompt.get(commandSelectedArgs, (err, result) => {
				let resultArgs = this.getArgsFromObject(commandSelectedArgs, result);
				resolve(resultArgs);
			});
		});
	}

	getArgsFromObject(args, objectToGetArg) {
		return args.reduce((ant, prox) => {
			let objectToAssign = {};
			objectToAssign[prox] = objectToGetArg[prox];

			return Object.assign(ant, objectToAssign);
		}, {});
	}

	validInit(config, command) {
		let errorsBaseConfig = getMissingProperties(config, ['commands']);
		let isValid = true;

		if (errorsBaseConfig && errorsBaseConfig.length > 0) {
			isValid = false;
			return errorsBaseConfig.forEach(error => logError(`Not found parameter ${error}`));
		}

		let commandSelected = config.commands[command];
		if (!commandSelected) {
			isValid = false;
			return logError(`Not found command > ${command} <`);
		}

		return isValid;
	}
}
// Utils
export default Make;
