const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const untagOneDBInstance = require('../../src/rds/untagOneDBInstance');
const { RDSClient, RemoveTagsFromResourceCommand } = require('@aws-sdk/client-rds');

const rdsMock = mockClient(RDSClient);

describe('untagOneDBInstance', () => {
  beforeEach(() => {
    rdsMock.reset();
  });
  
  it('returns an arn of an RDS DB instance if the tag removal is succesfull', async () => {
    const mockTagResponse = true;
    rdsMock
      .on(RemoveTagsFromResourceCommand)
      .resolves(mockTagResponse)
    const arn_1 = await untagOneDBInstance('somearn');
    assert.deepEqual(arn_1, 'somearn');
  });
});
