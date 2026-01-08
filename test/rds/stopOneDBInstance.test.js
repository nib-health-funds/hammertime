const AWSMock = require('aws-sdk-mock');
const assert = require('assert');

describe('stopOneDBInstance', () => {
  beforeEach(() => {
    // Clear require cache so aws-sdk gets loaded fresh after mock is set up
    delete require.cache[require.resolve('aws-sdk')];
    delete require.cache[require.resolve('../../src/rds/stopOneDBInstance')];
    
    const mockResponse = {
      DBInstance: {
        DBInstanceIdentifier: 'somenstanceid',
        DBInstanceStatus: 'available',
        DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:somenstanceid'
      }
    };
    AWSMock.mock('RDS', 'stopDBInstance', (params, callback) => {
      callback(null, mockResponse);
    });
  });

  it('returns an arn of a stopped RDS DB instance', () => {
    const stopOneDBInstance = require('../../src/rds/stopOneDBInstance');
    return stopOneDBInstance('arn:aws:rds:aws-region:aws-account:db:somenstanceid')
      .then((arn) => {
        assert.deepEqual(arn, 'arn:aws:rds:aws-region:aws-account:db:somenstanceid');
      });
  });
  afterEach(() => {
    AWSMock.restore('RDS', 'stopDBInstance');
  });
});
