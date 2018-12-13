import fs from 'fs';
import { getFile } from '../../utils/util';
import EntityManager from './entityManager';
import chalk from 'chalk';

class Entity {
	constructor() {
		this.name = 'entity';
		this.configuration = {};

        this.files     = []
        this.fileInUse = undefined;
        this.entity    = undefined;
        this.transportFiles = []
        this.entitys   = []
	}

	async config(configPlugin, globalArgs, render, baseConfig, transportFiles) {
        let configAssign = Object.assign({}, configPlugin);
        this.baseDir      = `${process.cwd()}${baseConfig.base_dir}`;
        
		if (!configAssign.entity_dir) throw new Error('>>entity_dir<< not defined');
        if (!configAssign.field_dir) throw new Error('>>field_dir<< not defined');
        
        this.configuration  = configAssign;
        this.transportFiles = transportFiles;
        this.render         = render;
        this.entitys        = this.getEntitysConfig()
    }

    getEntitysConfig(){
        let files = this.getFilesEntityFolder()
        return files.map(file=>{
            return JSON.parse(fs.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${file}`, 'utf-8'))
        })
    }

    getFilesEntityFolder(){
        return fs.readdirSync(`${this.baseDir}/${this.configuration.entity_dir}`);
    }
    
    async initTransport(){
        if(this.files.length === 0)
            this.files = this.getFilesEntityFolder()

        this.fileInUse = this.files.shift();

        console.log(chalk.green(`Plugin:${this.name} process file ${this.fileInUse}`))

        let entityJson = fs.readFileSync(`${this.baseDir}${this.configuration.entity_dir}/${this.fileInUse}`, 'utf-8');
        this.entity = new EntityManager(this.configuration, this.baseDir, this.render);
        this.entity.fromJson(entityJson);
    }

	async beforeRender(objectToSetArgs = {}) {
        objectToSetArgs[`${this.name}:name`] = this.entity.name
        objectToSetArgs[`${this.name}:attributes`] = this.entity.getRenderedAttributes()
        objectToSetArgs[`${this.name}:files`] = this.getFilesEntityFolder()
        objectToSetArgs[`${this.name}:entitys_config`] = this.entitys

		return objectToSetArgs;
    }
    
    async doneRender(loop=false){
        let hasFiles = !this.files.length == 0;
        loop = hasFiles
        return { loop };
    }
}

export default Entity;