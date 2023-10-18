const AWS = require('aws-sdk-mock');
const assert = require('assert');
const startOneDBInstance = require('../../src/rds/startOneDBInstance');

describe('startOneDBInstance', () => {
  it('returns an arn of a started RDS DB instance', () => {
    const mockResponse = {
      DBInstance: [{
          DBInstanceIdentifier: 'somenstanceid',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid',
        }
      ]
    };
    AWS.mock('RDS', 'startDBInstance', mockResponse);
    return startOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid')
      .then((arn) => {
        assert.deepEqual(arn, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'startDBInstance');
  });
});
