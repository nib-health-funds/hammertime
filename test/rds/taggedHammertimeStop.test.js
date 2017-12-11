const AWS = require('aws-sdk-mock');
const assert = require('assert');
const taggedHammertimeStop = require('../../src/rds/taggedHammertimeStop');

describe('taggedHammertimeStop', () => {
  it('returns an arn of an RDS DB instance tagged with "hammertime:stop"', () => {
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
    AWS.mock('RDS', 'listTagsForResource', mockTagList);
    return taggedHammertimeStop('somearn')
      .then((arn) => {
        assert.deepEqual(arn, 'somearn');
      });
  });
  it('returns a null value if RDS DB instance is not tagged with "hammertime:stop"', () => {
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
    AWS.mock('RDS', 'listTagsForResource', mockTagList);
    return taggedHammertimeStop('somearn')
      .then((arn) => {
        console.log("ARN output: " + arn);
        assert.deepEqual(arn, null);
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'listTagsForResource');
  });
});
