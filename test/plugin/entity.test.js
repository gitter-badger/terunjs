let assert = require('chai').assert;

let Entity = require('../../lib/plugins/entity/entity').default;
let Attribute = require('../../lib/plugins/entity/attribute').default;

let entidade = new Entity()

async function assertThrowsAsync(fn, regExp) {
    let f = () => {};
    try {
        await fn();
    } catch(e) {
        f = () => {throw e};
    } finally {
        assert.throws(f, regExp);
    }
}

describe('ENTITY:', function() {
    describe('getFilesEntityFolder()', function() {
        it('should return a throw Error when i put a wrong path', ()=> {
            assert.throws(function(){
                entidade.getFilesEntityFolder('')
            },'Path not defined to get entitys')
        });

        it('should return a throw Error when i put null', ()=> {
            assert.throws(function(){
                entidade.getFilesEntityFolder(null)
            },'Path not defined to get entitys')
        });

        it('should return a / when i put a valid folder with files', ()=> {
            let finded = entidade.getFilesEntityFolder(`${process.cwd()}/test/files/entitys_one_depth`);

            assert.isObject(finded)
            assert.deepOwnInclude(finded,{ '/': [ 'schema.2.json', 'schema.json' ] })
        });

        it('should return a / ,folderOne , folderTwo and files when i put a valid folder with files and folders', ()=> {
            let finded = entidade.getFilesEntityFolder(`${process.cwd()}/test/files/entitys_two_depth`);

            let expectedObject = { 
                '/': [ 'schema.2.json', 'schema.json' ], 
                folder: [ 'folder/schema.2.json', 'folder/schema.json' ] 
            }
            
            assert.isObject(finded)
            assert.deepOwnInclude(finded,expectedObject)
        });
    });

    
})

describe('ATTRIBUTE:', function() {
    describe('setDictionary(dictionary)', function() {
        describe('should return Number when i put a dictionary with kotlin number', function(){
            let attribute = new Attribute(null, null, null, null)
            attribute.type = "number";
            attribute.setDictionary({
                kotlin: {
                    number: 'Number'
                }
            })

            let result = attribute['type:kotlin'];

            assert.deepEqual(result, "Number")
        });
    })
})