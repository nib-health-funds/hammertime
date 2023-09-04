const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const taggedHammertimeStop = require('../../src/rds/taggedHammertimeStop');
const { RDSClient, ListTagsForResourceCommand } = require('@aws-sdk/client-rds');

const rdsMock = mockClient(RDSClient);

describe('taggedHammertimeStop', () => {
  beforeEach(() => {
    rdsMock.reset();
  });
  
  it('returns an arn of an RDS DB instance tagged with "hammertime:stop"', async () => {
    const mockTagList = {
      TagList: [{
          Key: 'hammertime:stop',
          Value: 'stopHammerTime'
        },
        {
          Key: 'Name',
          Value: 'itsHammer'
        }
      ]
    };
    rdsMock
      .on(ListTagsForResourceCommand)
      .resolves(mockTagList)
    const arn_1 = await taggedHammertimeStop('somearn');
    assert.deepEqual(arn_1, 'somearn');
  });
  it('returns a null value if RDS DB instance is not tagged with "hammertime:stop"', async () => {
    const mockTagList = {
      TagList: [{
          Key: 'summertime:gershwin',
          Value: 'fishAreJumping'
        },
        {
          Key: 'Name',
          Value: 'itsGershwin'
        }
      ]
    };
    rdsMock
      .on(ListTagsForResourceCommand)
      .resolves(mockTagList)
    const arn_1 = await taggedHammertimeStop('somearn');
    console.log("ARN output: " + arn_1);
    assert.deepEqual(arn_1, null);
  });
});
