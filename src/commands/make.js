import chalk from 'chalk';
import fs from 'fs';
import fx from 'mkdir-recursive';
import prompt from 'prompt';
import promptBox from 'prompt-checkbox'
import Plugin from '../plugins';
import Render from '../utils/render';
import { dropFileName, logError, validParameter } from '../utils/util';

class Make {
	constructor(config, command, tag_custom) {
		this.config = config;
		this.command = command;
		this.transportFiles = [];
		this.globalArgs = {};
		this.render = new Render(tag_custom);
		this.plugins = new Plugin(this.render);
	}

	async init() {
		let isValid = this.validInit(this.config, this.command);
		if (!isValid) return;

		let commandSelected = this.config.commands[this.command];

		//load global args COMMAND and config plugins
		await this.getGlobalArgs(commandSelected.args || []);
		this.plugins.init(commandSelected.plugins);
		await this.plugins.config(this.globalArgs, this.config, commandSelected.transport);

		// get transport
		this.transportFiles = commandSelected.transport;
		for (let transport of this.transportFiles) {
			if (!this.validTransport(transport)) return;
			console.log(chalk.magenta(`process: ${transport.from}`));

			await this.getTransport(transport);
		}

		if(this.transportFiles.length > 0){
			console.log(chalk.green('Success in create files!'));
		}else{
			console.log(chalk.yellow('Nothing to create!'));
		}
	}

	async createDir(to) {
		let dirToCreate = `${dropFileName(to)}`;
		return await fx.mkdirSync(dirToCreate);
	}

	async continueOverrideFile(pathFileExist){
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

		let fileExist = fs.existsSync(pathFileExist);
		let continueOverride = true;

		if(fileExist){
			let continueQuestionAnswer = await continueQuestion()
			continueOverride = !continueQuestionAnswer.length == 0;

			if(!continueOverride)
				console.log(chalk.yellow('Relax, you skipped file, nothing to do :)'));	
		}

		return continueOverride;
	}

	async getTransport(transport) {
		await this.plugins.initTransport();

		return new Promise((resolve) => {
			prompt.start();
			prompt.get(transport.args, async (err, result) => {
				if (err) throw new Error(err);

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
				let toFileName = this.render.renderSimple(toFilePath, Object.assign(argsToParseView, this.globalArgs, argsToRenderInFile));

				let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.globalArgs);
				let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile);

				
				await this.createDir(toFileName).catch(err => {
					console.log(chalk.red('Error on create folder'));
					throw new Error(err);
				});

				// let continueOverride = await this.continueOverrideFile(toFileName)

				// if(continueOverride)
					fs.writeFile(toFileName, fileRendered, 'utf-8', (err) => {
						if (err) throw new Error(err);
					});

				// Done life
				let done = await this.plugins.doneRender();

				if(done.loop){
					await this.getTransport(transport)
					resolve()
				}else{
					resolve()
				}
			});
		});
	}
	
	getGlobalArgs(commandSelectedArgs) {
		if (commandSelectedArgs.length > 0) console.log(chalk.magenta('set GLOBAL args: '));

		return new Promise((resolve, reject) => {
			prompt.start();
			prompt.get(commandSelectedArgs, (err, result) => {
				this.globalArgs = this.getArgsFromObject(commandSelectedArgs, result);
				resolve();
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
		let errorsBaseConfig = validParameter(config, ['base_dir', 'commands']);
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

	validTransport(transport) {
		let errorParametersTransport = validParameter(transport, ['from', 'to', 'args']);
		let isValid = true;
		if (errorParametersTransport && errorParametersTransport.length > 0) {
			isValid = false;
			return errorParametersTransport.forEach(error => logError(`Not found parameter ${error}`));
		}

		return isValid;
	}
}
// Utils
export default Make;