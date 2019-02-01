import fs from 'fs';
import EntityManager from './entityManager';
import chalk from 'chalk';
import promptCheckbox from 'prompt-checkbox';
import { logError } from '../../utils/util'

class Entity {
	constructor() {
		this.name           = 'entity';
		this.configuration  = {};
        this.files          = []
        this.fileInUse      = undefined;
        this.entity         = undefined;
        this.transportFiles = []
        this.entitys        = []
    }

	async config(configPlugin, globalArgs, render, baseConfig, transportFiles) {
        let configAssign = Object.assign({}, configPlugin);
        this.baseDir      = `${process.cwd()}/`;
        
		if (!configAssign.entity_dir) throw new Error('>>entity_dir<< not defined');
        if (configAssign.field && !configAssign.field.dir) throw new Error('>>field.dir<< not defined');
        if (configAssign.field && !configAssign.field.extension) throw new Error('>>field.extension<< not defined');

        this.configuration  = configAssign;
        this.files_to_work  = await this.getFilesEntityFolder()

        if(this.files_to_work.length == 0){
            throw new Error(logError('Need minimum a  model file selected to work.'));
        }

        this.transportFiles = transportFiles;
        this.render         = render;
        this.entitys        = this.getEntitysConfig()
    }

    getEntitysConfig(){
        let files = this.files_to_work

        return files.map(file=>{
            return JSON.parse(fs.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${file}`, 'utf-8'))
        })
    }

    async getFilesEntityFolder(){
        let files = fs.readdirSync(`${this.baseDir}/${this.configuration.entity_dir}`);

        let promptFiles = new promptCheckbox({
            name: 'files',
            radio: true,
            message: 'Choise the files to resolve:',
            choices: files
        })

        let result = await promptFiles.run()

        return result || [] 
    }
    
    async initTransport(){
        if(this.files.length === 0)
            this.files = [...this.files_to_work]

        this.fileInUse = this.files.shift();

        console.log(chalk.green(`Plugin:${this.name} process file ${this.fileInUse}`))

        let entityJson = fs.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${this.fileInUse}`, 'utf-8');
        this.entity = new EntityManager(this.configuration, this.baseDir, this.render);
        this.entity.fromJson(entityJson);
    }

	async beforeRender(objectToSetArgs = {}) {
        objectToSetArgs[`${this.name}:name`] = this.entity.name
        objectToSetArgs[`${this.name}:forms`] = this.entity.getRenderedAttributes()
        objectToSetArgs[`${this.name}:files`] = this.files_to_work
        objectToSetArgs[`${this.name}:entitys_config`] = this.entitys
        objectToSetArgs[`${this.name}:references`] = this.entity.getReferences()
        objectToSetArgs[`${this.name}:attributes`] = this.entity.attributes
        objectToSetArgs[`${this.name}:custom`] = this.entity.custom

		return objectToSetArgs;
    }
    
    async doneRender(loop=false){
        let hasFiles = !this.files.length == 0;
        loop = hasFiles
        return { loop };
    }
}

export default Entity;