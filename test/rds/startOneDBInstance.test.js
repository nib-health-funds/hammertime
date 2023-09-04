const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const startOneDBInstance = require('../../src/rds/startOneDBInstance');
const { RDSClient, StartDBInstanceCommand } = require('@aws-sdk/client-rds');

const rdsMock = mockClient(RDSClient);

describe('startOneDBInstance', () => {
  beforeEach(() => {
    rdsMock.reset();
  });

  it('returns an arn of a started RDS DB instance', async () => {
    const mockResponse = {
      DBInstance: [{
          DBInstanceIdentifier: 'somenstanceid',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid',
        }
      ]
    };
    rdsMock
      .on(StartDBInstanceCommand)
      .resolves(mockResponse)
    const arn_1 = await startOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid');
    assert.deepEqual(arn_1, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
  });
});
