import chalk from 'chalk';

export default {
    getConfig(env) {
        try {
            return require(`${process.cwd()}/terun.${env}.json`);
        } catch (e) {
            console.log(chalk.red(`Error in get config terun.json`))
            return null;
        }
    }
}