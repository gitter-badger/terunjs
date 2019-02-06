import fs from 'fs';
import EntityManager from './entityManager';
import chalk from 'chalk';
import promptCheckbox from 'prompt-checkbox';
import { logError } from '../../utils/util'
import readrecursive from 'fs-readdir-recursive';
import { nullOrUndefined, isString } from '../../../lib/utils/util';

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
        this.files_to_work  = await this.selectFilesToWork(`${this.baseDir}/${this.configuration.entity_dir}`)

        if(this.files_to_work.length == 0){
            throw new Error(logError('Need minimum a  model file selected to work.'));
        }

        this.transportFiles = transportFiles;
        this.render         = render;
    }

    getFilesEntityFolder(path){
        if(nullOrUndefined(path) || !isString(path) || path.length < 1) throw new Error('Path not defined to get entitys');

        let files = readrecursive(path);

        let splitFolderName = (file) => {
            let [folder, fileName] = file.split('/')
            return {
                folder,
                fileName
            }
        }

        let getFileName = (file)=> splitFolderName(file).fileName
        let getByFileName = (folderName)=> (file) => splitFolderName(file).folder === folderName
        let getFolderName = (file)=> splitFolderName(file).folder
        let getWithoutFolder = (file) => !splitFolderName(file).fileName
        
        let keys = files
            .filter(getFileName)
            .map(getFolderName)

        let choices = {
            "/": files.filter(getWithoutFolder)
        }

        keys.forEach((key)=> {
            let filesFromKey = files.filter(getByFileName(key))
            choices[key] = filesFromKey
        })

        return choices;
    }

    async selectFilesToWork(path){
        let choices = this.getFilesEntityFolder(path);

        let promptFiles = new promptCheckbox({
            name: 'files',
            radio: true,
            message: 'Choise the files to resolve:',
            choices
        })

        let result = await promptFiles.run()

        return result || [] 
    }
    
    async initTransport(){
        if(!this.files.length)
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
        objectToSetArgs[`${this.name}:references`] = this.entity.getReferences()
        objectToSetArgs[`${this.name}:attributes`] = this.entity.attributes
        objectToSetArgs[`${this.name}:custom`] = this.entity.custom

		return objectToSetArgs;
    }
    
    async doneRender(loop=false){
        let hasFiles = this.files.length;
        loop = hasFiles
        return { loop };
    }
}

export default Entity;