import chalk from 'chalk';

class ConfigManager{
    constructor(base_path){
        this.config_folder = 'config'  
        this.config_path   = `${process.cwd()}/${this.config_folder}`;
    }

    getMainConfig(env) {
        try {
            return require(`${process.cwd()}/terun.${env}.json`);
        } catch (e) {
            console.log(chalk.red(`Config > terun.${env}.json < not found`));

            throw new Error(e);
            return null;
        }
    }

    getPipeFunctions() {
        try {
            return require(`${this.config_path}/pipes.js`);
        } catch (e) {
            console.log(chalk.red('Error in get config pipes.js'));
            return null;
        }
    }

    getConfigFields(){
        try {
            let file = fs.readFileSync(`${this.config_path}/fields.json`,'utf-8');
            return JSON.parse(file);
        } catch (e) {
            return {}
        }
    }

}

export default new ConfigManager