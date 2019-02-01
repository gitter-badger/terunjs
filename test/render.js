let assert = require('assert');
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
    });
});