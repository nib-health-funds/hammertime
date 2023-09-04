const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const notTaggedUntouchable = require('../../src/rds/notTaggedUntouchable');
const { RDSClient, ListTagsForResourceCommand } = require('@aws-sdk/client-rds')

const rdsMock = mockClient(RDSClient);

describe('notTaggedUntouchable', () => {
  beforeEach(() => {
    rdsMock.reset();
  });

  it('returns a null if an RDS DB instance is tagged with "hammertime:canttouchthis"', async () => {
    const mockTagList = {
      TagList: [{
          Key: 'hammertime:canttouchthis',
          Value: 'homeBoy'
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
    const arn_1 = await notTaggedUntouchable('somearn');
    assert.deepEqual(arn_1, null);
  });
  it('returns an arn if an RDS DB instance is not tagged with "hammertime:canttouchthis"', async () => {
    const mockTagList = {
      TagList: [{
          Key: 'summertime:gershwin',
          Value: 'andTheCottonIsHigh'
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
    const arn_1 = await notTaggedUntouchable('somearn');
    assert.deepEqual(arn_1, 'somearn');
  });
});
