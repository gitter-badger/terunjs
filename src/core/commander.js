import program from 'commander';
const _package = require('../../package.json');

program
	.version(_package.version)
	.option('--make [command](optional)', 'Make a crud with a config file (terun.default.js)')
	.option('--init', 'Make a config file')
	.option('--env', 'Set your env file')
	.option('--version', 'See Terun version')
	.parse(process.argv);

export default program;
