let assert = require('chai').assert;
let nixt = require('nixt');
let packg = require('../package.json')

let folder_cli_path =  `${__dirname}/files/cli`;

describe('CLI:', function() {
    describe('--version', function() {
        it('should return the current version', function(done) {
            nixt()
                .run('terun --version')
                .stdout(packg.version)
                .end(done)
        });
    });

    describe('-V', function() {
        it('should return the current version', function(done) {
            nixt()
                .run('terun --version')
                .stdout(packg.version)
                .end(done)
        });
    });

    describe('--make', function() {
        it('should try get terun.default.json but throw a error', function(done) {
            nixt()
                .run('terun --make')
                .stderr(/Config > terun.default.json < not found/g)
                .end(done)
        });


        it('should try run --make with a wrong command', function(done) {
            nixt()
                .env('WORK_PATH', folder_cli_path)
                .run('terun --make wrong')
                .stderr(/Command >wrong< not found. See your terun.\[env\].json/g)
                .end(done)
        });
        
        describe('--env', function(){
            it('should try run --make with --env but without transport files', function(done) {
                nixt()
                    .env('WORK_PATH', folder_cli_path)
                    .run('terun --make test --env empty')
                    .stderr(/Nothing to create!/g)
                    .end(done)
            });
    
            it('should try run --make with wrong --env', function(done) {
                nixt()
                    .env('WORK_PATH', folder_cli_path)
                    .run('terun --make test --env wrong')
                    .stderr(/Config > terun.wrong.json < not found/g)
                    .end(done)
            });
    
            it('should try run --make with --env with files', function(done) {
                nixt()
                    .env('WORK_PATH', folder_cli_path)
                    .run('terun --make test --env files')
                    .stdout(/process: template\/form.html/g)
                    .end(done)
            });
        }) ;

        it('should try get a badly terun.badly.json', function(done) {
            nixt()
                .env('WORK_PATH', folder_cli_path)
                .run('terun --make badly --env badly')
                .stderr(/Not found parameter commands/g)
                .end(done)
        });
    });
});