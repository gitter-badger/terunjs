import program from 'commander';
const _package = require('../../package.json');

program
	.version(_package.version)
	.option('-m, --make [command](optional)', 'Make a crud with a config file (terun.default.js)')
	.option('-i, --init', 'Make a config file')
	.option('--env [type]', 'Set your env file')
	.option('--version', 'See Terun version')
	.option('-oal --override-all', 'Plugin: Entity - Override the files')
	.parse(process.argv);

export default program;
