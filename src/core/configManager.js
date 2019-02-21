import chalk from 'chalk';

class ConfigManager{
    constructor(base_path){
        this.config_folder = 'config'  
        this.config_path   = `${process.cwd()}/${this.config_folder}`;
    }

    getMainConfig(env = 'default') {
        try {
            return require(`${process.env.WORK_PATH || process.cwd()}/terun.${env}.json`);;
        } catch (e) {
            throw new Error(chalk.red(`Config > terun.${env}.json < not found or empty`));
        }
    }

    getMainConfigWithPath(path,env) {
        try {
            return require(`${path}/terun.${env}.json`);
        } catch (e) {
            throw new Error(e);
        }
    }

    getPipelineFunctionsFile() {
        try {
            return require(`${this.config_path}/pipes.js`);
        } catch (e) {
            return null;
        }
    }

    getConfigAttributes(){
        try {
            return require(`${this.config_path}/attributes.js`,'utf-8');
        } catch (e) {
            return {}
        }
    }

}

export default new ConfigManager