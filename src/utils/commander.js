import program from 'commander';
const _package = require('../../package.json');

program
	.version('1.2.4')
	.option('--make [command](optional)', 'Make a crud with a config file (terun.default.js)')
	.option('--init', 'Make a config file')
	.option('--env', _package.version)
	.parse(process.argv);

export default program;
