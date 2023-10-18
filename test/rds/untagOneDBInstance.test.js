const AWS = require('aws-sdk-mock');
const assert = require('assert');
const untagOneDBInstance = require('../../src/rds/untagOneDBInstance');

describe('untagOneDBInstance', () => {
  it('returns an arn of an RDS DB instance if the tag removal is succesfull', () => {
    const mockTagResponse = true;
    AWS.mock('RDS', 'removeTagsFromResource', mockTagResponse);
    return untagOneDBInstance('somearn')
      .then((arn) => {
        assert.deepEqual(arn, 'somearn');
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'removeTagsFromResource');
  });
});
