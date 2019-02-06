import chalk from 'chalk';
import fs from 'fs';
import prompt from 'prompt';
import promptBox from 'prompt-checkbox'
import Plugin from '../plugins';
import Render from '../core/render';
import TransportManager from '../core/transport';
import { createDir, validObjectThrow } from '../utils/util';

class Make {
	constructor(config, tag_custom) {
		this.config = config;
		this.commandArg = null;
		this.command    = null
		this.transportManager = new TransportManager();
		this.globalArgs = {};
		this.render = new Render(tag_custom);
		this.plugins = new Plugin(this.render);
		this.overrideAll = false;

		if(!validObjectThrow(this.config, ['commands'])) return false;
	}
	async init() {
		//load global args COMMAND and config plugins
		this.globalArgs = await this.getGlobalArgs(this.command.args || []);

		// PLUGIN init
		this.plugins.init(this.command.plugins);
		await this.plugins.config(this.globalArgs, this.config, this.command.transport);

		// TRANSPORT FILES
		this.transportManager.setFiles(this.command.transport);
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
			throw new Error(`Nothing to create!`)
		}
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
		prompt.get(transport.args, async (err, promptResult) => {
			if (err) throw new Error(err);

			// PATHS
			let baseDirPath = `${process.cwd()}/`;
			let fromFilePath = `${baseDirPath}${transport.from}`;
			let toFilePath = `${baseDirPath}${transport.to}`;

			// render final file ARGS
			let argsToRenderInFile = promptResult;

			// life cycle before render
			argsToRenderInFile = await this.plugins.beforeRender(argsToRenderInFile);

			// render file name with mustache js
			let toFileName = this.render.renderSimple(toFilePath, Object.assign(promptResult, this.globalArgs, argsToRenderInFile));

			let argsToRenderFinalFile = Object.assign(argsToRenderInFile, this.globalArgs);
			let fileRendered = this.render.renderFile(fromFilePath, argsToRenderFinalFile);


			// Cria os diretorios de forma recursiva.
			await createDir(toFileName).catch(err => {
				throw new Error(chalk.red('Error on create folder'));
			});

			let continueOverride = this.overrideAll ? true : await this.continueOverrideFile(toFileName)

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
				console.log(chalk.yellow('Relax, you skipped file!'));
		}

		return continueOverride;
	}

	setCommand(commandArg){
		this.commandArg = commandArg;
		this.command    = this.config.commands[this.commandArg];
		
		if(!this.command){
			throw new Error(chalk.yellow(`Command >${this.commandArg}< not found. See your terun.[env].json`));
		}

		if(!validObjectThrow(this.command, ['transport'])) throw new Error(chalk.yellow(`Transport not defined in command`));
	}

	setOverrideAll(overrideAll){
		this.overrideAll = overrideAll ? true : false
	}

	getGlobalArgs(globalArgs) {
		if (globalArgs.length > 0) console.log(chalk.magenta('GLOBAL args:'));

		return new Promise((resolve, reject) => {
			prompt.start();
			prompt.get(globalArgs, (err, result) => {
				resolve(result);
			});
		});
	}
}
// Utils
export default Make;
