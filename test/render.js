let assert = require('chai').assert;
let pipelineFunction = require('../lib/core/pipeline_function').default;

let Render = require('../lib/core/render.js').default
let render = new Render()


describe('RENDER:', function() {
    describe('renderSimple()', function() {
        it('should return test when i put test in object args and using custom tags', function() {
            let customTags = ['::','::'];
            let object = {
                name: "test"
            };
            let result = render.renderSimple('::name::',object,customTags)

            assert.deepEqual(result,'test');
        });

        it('should return test from TEST using pipeline operator default', function() {
            let object = {
                name: "TEST"
            };
            let result = render.renderSimple('{{name | lower}}',object)

            assert.deepEqual(result,'test');
        });

        it('should return test from TEST using pipeline operator default and a undefined pipeline', function() {
            let object = {
                name: "TEST"
            };
            let result = render.renderSimple('{{name | lower | undefined}}',object)

            assert.deepEqual(result,'test');
        });
    });

    describe('renderFile()', function() {
        it('should return a content rendered from file', function() {
            let object = {
                name: "test"
            };
            let result = render.renderFile(`${process.cwd()}/test/files/render_file.txt`,object)

            assert.deepEqual(result,'test');
        });

        it('should return null when i put null', function() {
            let object = {
                name: "test"
            };
            let result = render.renderFile(`${process.cwd()}/test/files/render_file.txt`,null)

            assert.deepEqual(result, null);
        });
    });

    

    describe('mergePipeline()', function() {
        it('should return a merged object', function() {
            let object = {
                name:"test",
                person:{
                    name:"test_person"
                }
            };

            let result = render._mergePipeline(object);
            assert.include(result, object);
            assert.include(result, pipelineFunction);
        });
    });
});