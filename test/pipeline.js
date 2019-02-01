let assert = require('assert');
let pipeline = require('../lib/core/pipeline.js')

describe('Pipeline Operator', function() {
    it('should return [name,upper] when i put \'name | upper\'', function() {
        let pipes = pipeline.splitPipe("name | upper")

        assert.deepEqual(pipes,['name','upper']);
    });

    it('should return [name,upper,lower] when i put \'name | upper | lower\'', function() {
        let pipes = pipeline.splitPipe("name | upper | lower")

        assert.deepEqual(pipes,['name','upper','lower']);
    });

    it('should return [name] when i put \'name\'', function() {
        let pipes = pipeline.splitPipe("name")

        assert.deepEqual(pipes,['name']);
    });

    it('should return [] when i put null', function() {
        let pipes = pipeline.splitPipe(null)

        assert.deepEqual(pipes,[]);
    });
});