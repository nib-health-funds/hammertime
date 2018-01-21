const filterOutNulls = require('../../src/utils/filterOutNulls');
const assert = require('assert');

describe('filterOutNulls', () => {
  it('removes null values from an array', () => {
    assert.deepEqual(filterOutNulls(['Give', 'me', 'a', null, 'song', 'or', null, 'rhythm', null]), ['Give', 'me', 'a', 'song', 'or', 'rhythm']);
  });
});
