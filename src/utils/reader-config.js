import chalk from 'chalk';

function getConfig(env) {
	try {
		return require(`${process.cwd()}/terun.${env}.json`);
	} catch (e) {
		console.log(chalk.red('Error in get config terun.json'));
		return null;
	}
}

export default {
	getConfig
};