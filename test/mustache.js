let assert = require('assert');
let mustache = require('../lib/core/mustache.js').default

describe('Mustache', function() {
    it('should return \'test\' when i put a object with name', function() {
        let result = mustache.render('{{name}}',{
            name: 'test'
        })

        assert.deepEqual(result,'test');
    });

    it('should return \'\' when i put a object with missing properties', function() {
        let result = mustache.render('{{name}}',{
            test: 'test'
        })

        assert.deepEqual(result,'');
    });

    it('should return \'TEST\' when i put a \'test\' and a pipeoperator called upper', function() {
        let result = mustache.render('{{name | upper}}',{
            name: 'test'
        })

        assert.deepEqual(result,'TEST');
    });

    it('should return \'Test\' when i put a \'test\' and a pipeoperator called capitalize', function() {
        let result = mustache.render('{{name | capitalize}}',{
            name: 'test'
        })

        assert.deepEqual(result,'Test');
    });

    it('should return \'my_test\' when i put a \'MyTest\' and a pipeoperator called underscore', function() {
        let result = mustache.render('{{name | underscore}}',{
            name: 'MyTest'
        })

        assert.deepEqual(result,'my_test');
    });

    it('should return \'myTest\' when i put a \'MyTest\' and a pipeoperator called firstlower', function() {
        let result = mustache.render('{{name | firstlower}}',{
            name: 'MyTest'
        })

        assert.deepEqual(result,'myTest');
    });

    it('should return \'MyTest\' when i put a \'MyTest\' and a pipeoperator called a missing function', function() {
        let result = mustache.render('{{name | missingFunction }}',{
            name: 'MyTest'
        })

        assert.deepEqual(result,'MyTest');
    });

    it('should return \'MyTest\' when i put a \'MyTest\' and a pipeoperator withoun function', function() {
        let result = mustache.render('{{name | }}',{
            name: 'MyTest'
        })

        assert.deepEqual(result,'MyTest');
    });

    it('should return \'MyTest\' when i put a \'MyTest\' and a pipeoperator withoun function', function() {
        let result = mustache.render('{{name || }}',{
            name: 'MyTest'
        })

        assert.deepEqual(result,'MyTest');
    });
});