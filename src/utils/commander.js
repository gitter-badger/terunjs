import program from 'commander';


program
    .version('0.0.1')
    .option('--make [env] [command](optional)', 'Make a crud with a config file (terun.js)')
    .parse(process.argv);

export default program;