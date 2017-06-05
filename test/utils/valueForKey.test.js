const assert = require('assert');
const valueForKey = require('../../src/utils/valueForKey');

describe('valueForKey()', () => {
  it('should return correct value for key', () => {
    const value = 'MC Hammer';
    assert.deepEqual(valueForKey([
      {
        Key: 'Name',
        Value: value,
      },
      {
        Key: 'Pants',
        Value: 'Parachute',
      },
    ], 'Name'), value);
  });
});
