const AWS = require('aws-sdk-mock');
const assert = require('assert');
const filterStartableDBInstances = require('../../src/rds/filterStartableDBInstances');
const taggedHammertimeStop = require('../../src/rds/taggedHammertimeStop');

describe('startableInstances', () => {
  describe('filterStartableDBInstances()', () => {
    it('returns a list of stopped RDS DB instances', () => {
      const mockDBInstances = {
        DBInstances: [{
            DBInstanceIdentifier: 'i-availableone',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availableone',
          },
          {
            DBInstanceIdentifier: 'i-availabletoo',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availabletoo',
          },
          {
            DBInstanceIdentifier: 'i-stopped',
            DBInstanceStatus: 'stopped',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-stopped',
          }
        ]
      }
      AWS.mock('RDS', 'describeDBInstances', mockDBInstances);
      return filterStartableDBInstances()
        .then((arns) => {
          assert.deepEqual(arns, ['arn:aws:rds:aws-region:aws-account:db:i-stopped']);
        });
    });
    it('returns an empty list if no instances are found in AWS', () => {
      const mockDBInstances = {
        DBInstances: []
      }
      AWS.mock('RDS', 'describeDBInstances', mockDBInstances);
      return filterStartableDBInstances()
        .then((arns) => {
          assert.deepEqual(arns, []);
        });
    });
    afterEach(() => {
      AWS.restore('RDS', 'describeDBInstances');
    });
  });
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
});
