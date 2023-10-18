const AWS = require('aws-sdk-mock');
const assert = require('assert');
const notTaggedUntouchable = require('../../src/rds/notTaggedUntouchable');

describe('notTaggedUntouchable', () => {
  it('returns a null if an RDS DB instance is tagged with "hammertime:canttouchthis"', () => {
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
    AWS.mock('RDS', 'listTagsForResource', mockTagList);
    return notTaggedUntouchable('somearn')
      .then((arn) => {
        assert.deepEqual(arn, null);
      });
  });
  it('returns an arn if an RDS DB instance is not tagged with "hammertime:canttouchthis"', () => {
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
    AWS.mock('RDS', 'listTagsForResource', mockTagList);
    return notTaggedUntouchable('somearn')
      .then((arn) => {
        assert.deepEqual(arn, 'somearn');
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'listTagsForResource');
  });
});
