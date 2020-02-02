const assert = require('assert');
const createTag = require('../../src/utils/createTag.js');

describe('createTag()', () => {
  it('should return correct tag object', () => {
    assert.deepEqual(createTag('key', 'resourceId', 'resourceType', 'value'), {
      Key: 'key',
      PropagateAtLaunch: false,
      ResourceId: 'resourceId',
      ResourceType: 'resourceType',
      Value: 'value',
    });
  });
});
