import program from 'commander';


program
    .version('0.0.1')
    .option('--make [env] [command](optional)', 'Make a crud with a config file (terun.[env].js)')
    .option('--init', 'Make a config file')
    .parse(process.argv);

export default program;