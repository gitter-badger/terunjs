let assert = require('assert');
let utils = require('../lib/utils/util')

describe('flatArray()', function() {
  it('should return a array with [1,2,3] and depth = 1', function() {
    let result = utils.flatArray([1,[2],3])
    assert.deepEqual(result,[1,2,3]);
  });

  it('should return a array with [1,2,3] and depth = 2', function() {
    let result = utils.flatArray([1,[[2],3]], 2)
    assert.deepEqual(result,[1,2,3]);
  });
});
