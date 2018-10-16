import program from 'commander';


program
    .version('0.0.1')
    .option('--make [command](optional)', 'Make a crud with a config file (terun.default.js)')
    .option('--init', 'Make a config file')
    .option('--env', 'Set env')
    .parse(process.argv);

export default program;