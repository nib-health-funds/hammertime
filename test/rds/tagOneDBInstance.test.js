const AWS = require('aws-sdk-mock');
const assert = require('assert');
const tagOneDBInstance = require('../../src/rds/tagOneDBInstance');

describe('tagOneDBInstance', () => {
  it('returns an arn of an RDS DB instance if the tag addition is succesfull', () => {
    const mockTagResponse = true;
    AWS.mock('RDS', 'addTagsToResource', mockTagResponse);
    return tagOneDBInstance('somearn')
      .then((arn) => {
        assert.deepEqual(arn, 'somearn');
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'addTagsToResource');
  });
});
