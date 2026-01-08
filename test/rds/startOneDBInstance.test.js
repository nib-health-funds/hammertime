const AWSMock = require('aws-sdk-mock');
const assert = require('assert');

describe('startOneDBInstance', () => {
  beforeEach(() => {
    // Clear require cache so aws-sdk gets loaded fresh after mock is set up
    delete require.cache[require.resolve('aws-sdk')];
    delete require.cache[require.resolve('../../src/rds/startOneDBInstance')];
    
    const mockResponse = {
      DBInstance: {
        DBInstanceIdentifier: 'somenstanceid',
        DBInstanceStatus: 'available',
        DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid'
      }
    };
    AWSMock.mock('RDS', 'startDBInstance', (params, callback) => {
      callback(null, mockResponse);
    });
  });

  it('returns an arn of a started RDS DB instance', () => {
    const startOneDBInstance = require('../../src/rds/startOneDBInstance');
    return startOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid')
      .then((arn) => {
        assert.deepEqual(arn, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
      });
  });
  afterEach(() => {
    AWSMock.restore('RDS', 'startDBInstance');
  });
});
