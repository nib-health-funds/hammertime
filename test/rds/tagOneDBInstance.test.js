const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const tagOneDBInstance = require('../../src/rds/tagOneDBInstance');
const { RDSClient, AddTagsToResourceCommand } = require('@aws-sdk/client-rds');

const rdsMock = mockClient(RDSClient);

describe('tagOneDBInstance', () => {
  beforeEach(() => {
    rdsMock.reset();
  });
  
  it('returns an arn of an RDS DB instance if the tag addition is succesfull', async () => {
    const mockTagResponse = true;
    rdsMock
      .on(AddTagsToResourceCommand)
      .resolves(mockTagResponse)
    const arn_1 = await tagOneDBInstance('somearn');
    assert.deepEqual(arn_1, 'somearn');
  });
});
