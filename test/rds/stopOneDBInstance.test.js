const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const stopOneDBInstance = require('../../src/rds/stopOneDBInstance');
const { RDSClient, StopDBInstanceCommand } = require('@aws-sdk/client-rds');

const rdsMock = mockClient(RDSClient);

describe('stopOneDBInstance', () => {
  beforeEach(() => {
    rdsMock.reset();
  });
  it('returns an arn of a stopped RDS DB instance', async () => {
    const mockResponse = {
      DBInstance: [{
          DBInstanceIdentifier: 'somenstanceid',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid',
        }
      ]
    };
    rdsMock
      .on(StopDBInstanceCommand)
      .resolves(mockResponse)
    const arn_1 = await stopOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid');
    assert.deepEqual(arn_1, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
  });
});
