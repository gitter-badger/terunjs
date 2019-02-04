let assert = require('assert');
let utils = require('../lib/utils/util')

describe('UTILS:', function() {
  describe('flatArray()', function() {
    it('should return a array with [1,2,3] and depth = 1', function() {
      let result = utils.flatArray([1,[2],3])
      assert.deepEqual(result,[1,2,3]);
    });

    it('should return a array with [1,2,3] and depth = 2', function() {
      let depth = 2;
      let result = utils.flatArray([1,[[2],3]], depth)
      assert.deepEqual(result,[1,2,3]);
    });

    it('should return a array with [1,2,3] and depth = 3', function() {
      let depth = 3;
      let result = utils.flatArray([[1,[[2],3]]], depth)
      assert.deepEqual(result,[1,2,3]);
    });

    it('should return a empty array  when is a null parameter', function() {
      let result = utils.flatArray(null)
      assert.deepEqual(result,[]);
    });

    it('should return a array with [1,2,3] when depth is null', function() {
      let result = utils.flatArray([1,2,3], null)
      assert.deepEqual(result,[1,2,3]);
    });

    it('should return a empty array when parameter array not is a type array', function() {
      let result = utils.flatArray({}, null)
      assert.deepEqual(result,[]);
    });
  });

  describe('nullOrUndefined()', function() {
    it('should return a boolean true', function() {
      let result = utils.nullOrUndefined(null)
      assert.deepEqual(result,true);
    });

    it('should return a boolean false when i have put a parameter true', function() {
      let result = utils.nullOrUndefined({})
      assert.deepEqual(result,false);
    });
  });

  describe('getFile()', function() {
    it('should return a null because not have file for this', async function() {
      let result = await utils.getFile('random_error_file.txt');
      assert.deepEqual(result,null);
    });

    it('should return content of the file', async function() {
      let result = await utils.getFile(`${process.cwd()}/test/utils.txt`);
      assert.deepEqual(result,'test');
    });

    it('should return null when i put null', async function() {
      let result = await utils.getFile(null);
      assert.deepEqual(result,null);
    });
  });

  describe('pluralName()', function() {
    it('should return \'\' when i put null', async function() {
      let result = utils.pluralName(null);
      assert.deepEqual(result,'');
    });

    it('should return \'\' when i put \'\'', async function() {
      let result = utils.pluralName(null);
      assert.deepEqual(result,'');
    });

    it('should return pessoas when i put pessoa', async function() {
      let result = utils.pluralName('pessoa');
      assert.deepEqual(result,'pessoas');
    });
  });

  describe('firstLower()', function() {
    it('should return \'pessoa\' when i put Pessoa', async function() {
      let result = utils.firstLower('Pessoa');
      assert.deepEqual(result,'pessoa');
    });

    it('should return \'\' when i put null', async function() {
      let result = utils.firstLower(null);
      assert.deepEqual(result,'');
    });

    it('should return \'\' when i put \'\'', async function() {
      let result = utils.firstLower('');
      assert.deepEqual(result,'');
    });

    it('should return a when i put A', async function() {
      let result = utils.firstLower('A');
      assert.deepEqual(result,'a');
    });
  });

  describe('capitalize()', function() {
    it('should return \'Pessoa\' when i put pessoa', async function() {
      let result = utils.capitalize('pessoa');
      assert.deepEqual(result,'Pessoa');
    });

    it('should return \'PessoaLegal\' when i put pessoaLegal', async function() {
      let result = utils.capitalize('pessoa');
      assert.deepEqual(result,'Pessoa');
    });

    it('should return \'\' when i put \'\'', async function() {
      let result = utils.capitalize('');
      assert.deepEqual(result,'');
    });

    it('should return \'\' when i put null', async function() {
      let result = utils.capitalize(null);
      assert.deepEqual(result,'');
    });
  });

  describe('removeFileNameInPath()', function() {
    it('should return \'bin\' when i put \'/bin/test.txt\'', async function() {
      let result = utils.removeFileNameInPath('bin/text.txt');
      assert.deepEqual(result,'bin');
    });

    it('should return \'\' when i put \'\'', async function() {
      let result = utils.removeFileNameInPath('');
      assert.deepEqual(result,'');
    });

    it('should return \'\' when i put null', async function() {
      let result = utils.removeFileNameInPath(null);
      assert.deepEqual(result,'');
    });

    it('should return \'/bin\' when i put a array [bin,folder,text.txt]', async function() {
      let result = utils.removeFileNameInPath(['bin','folder','text.txt']);
      assert.deepEqual(result,'bin/folder');
    });
  });


  describe('clearwhitespace()', function() {
    it('should return TestTest when i put Test Test', function() {
      let result = utils.clearWhitespace('Test Test');
      assert.deepEqual(result,'TestTest');
    });

    it('should return \'\' when i put \'\'', function() {
      let result = utils.clearWhitespace('');
      assert.deepEqual(result,'');
    });

    it('should return \'\' when i put null', function() {
      let result = utils.clearWhitespace(null);
      assert.deepEqual(result,'');
    });
  });

  describe('getMissingProperties()', function() {
    it('should return ["work","parent"] when i put missing properties', function() {
      let object = {
        name:"test",
        age:20
      }

      let result = utils.getMissingProperties(object, ['work','parent']);
      assert.deepEqual(result,['work','parent']);
    });

    it('should return [] when i put existing properties', function() {
      let object = {
        name:"test",
        age:20
      }

      let result = utils.getMissingProperties(object, ['name','age']);
      assert.deepEqual(result,[]);
    });

    it('should return [] when i put null in object', function() {
      let result = utils.getMissingProperties(null, ['name','age']);
      assert.deepEqual(result,[]);
    });

    it('should return [] when i put null in parameter', function() {
      let object = {
        name:"test",
        age:20
      }

      let result = utils.getMissingProperties(object, null);
      assert.deepEqual(result,[]);
    });

    it('should return [] when i put null in parameter and in object', function() {
      let result = utils.getMissingProperties(null, null);
      assert.deepEqual(result,[]);
    });
  });
});