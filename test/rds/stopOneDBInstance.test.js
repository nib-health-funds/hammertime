const AWS = require('aws-sdk-mock');
const assert = require('assert');
const stopOneDBInstance = require('../../src/rds/stopOneDBInstance');

describe('stopOneDBInstance', () => {
  it('returns an arn of a stopped RDS DB instance', () => {
    const mockResponse = {
      DBInstance: [{
          DBInstanceIdentifier: 'somenstanceid',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid',
        }
      ]
    };
    AWS.mock('RDS', 'stopDBInstance', mockResponse);
    return stopOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid')
      .then((arn) => {
        assert.deepEqual(arn, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
      });
  });
  afterEach(() => {
    AWS.restore('RDS', 'stopDBInstance');
  });
});
