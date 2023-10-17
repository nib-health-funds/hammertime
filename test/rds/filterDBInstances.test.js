const { mockClient } = require('aws-sdk-client-mock');
const assert = require('assert');
const filterDBInstances = require('../../src/rds/filterDBInstances');
const notTaggedUntouchable = require('../../src/rds/notTaggedUntouchable');
const { RDSClient, DescribeDBInstancesCommand, ListTagsForResourceCommand } = require('@aws-sdk/client-rds')

const rdsMock = mockClient(RDSClient);

describe('instances', () => {
  beforeEach(() => {
    rdsMock.reset();
  });

  describe('filterDBInstances()', () => {
    it('returns a list of running RDS DB instances', async () => {
      const mockDBInstances = {
        DBInstances: [{
            DBInstanceIdentifier: 'i-availableone',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availableone',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],
          },
          {
            DBInstanceIdentifier: 'i-availabletoo',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availabletoo',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],
          },
          {
            DBInstanceIdentifier: 'i-stopped',
            DBInstanceStatus: 'stopped',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-stopped',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],
          }
        ]
      };
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('available');
      assert.deepEqual(arns, ['arn:aws:rds:aws-region:aws-account:db:i-availableone', 'arn:aws:rds:aws-region:aws-account:db:i-availabletoo']);
    });
    it('returns a list of stopped RDS DB instances', async () => {
      const mockDBInstances = {
        DBInstances: [{
            DBInstanceIdentifier: 'i-availableone',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availableone',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],

          },
          {
            DBInstanceIdentifier: 'i-availabletoo',
            DBInstanceStatus: 'available',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-availabletoo',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],

          },
          {
            DBInstanceIdentifier: 'i-stopped',
            DBInstanceStatus: 'stopped',
            DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-stopped',
            MultiAZ: false,
            ReadReplicaDBInstanceIdentifiers: [],
            ReadReplicaDBClusterIdentifiers: [],
          }
        ]
      }
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('stopped');
      assert.deepEqual(arns, ['arn:aws:rds:aws-region:aws-account:db:i-stopped']);
    });
    it('returns an empty list if all RDS DB instances are already stopped', async () => {
      const mockDBInstances = {
        DBInstances: [{
          DBInstanceIdentifier: 'i-stopped',
          DBInstanceStatus: 'stopped',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-stopped',
          MultiAZ: false,
          ReadReplicaDBInstanceIdentifiers: [],
          ReadReplicaDBClusterIdentifiers: [],
        }]
      };
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('available');
      assert.deepEqual(arns, []);
    });
    it('returns an empty list if no instances are found in AWS', async () => {
      const mockDBInstances = {
        DBInstances: []
      }
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances();
      assert.deepEqual(arns, []);
    });
    it('filters out multi az db instances', async () => {
      const mockDBInstances = {
        DBInstances: [{
          DBInstanceIdentifier: 'i-notstoppable',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-notstoppable',
          MultiAZ: true,
          ReadReplicaDBInstanceIdentifiers: [],
          ReadReplicaDBClusterIdentifiers: [],
        }]
      };
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('available');
      assert.deepEqual(arns, []);
    });
    it('filters out db instances with read replica instance identifiers', async () => {
      const mockDBInstances = {
        DBInstances: [{
          DBInstanceIdentifier: 'i-notstoppable',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-notstoppable',
          MultiAZ: false,
          ReadReplicaDBInstanceIdentifiers: ['replica1'],
          ReadReplicaDBClusterIdentifiers: [],
        }]
      };
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('available');
      assert.deepEqual(arns, []);
    });
    it('filters out db instances with read replica cluster identifiers', async () => {
      const mockDBInstances = {
        DBInstances: [{
          DBInstanceIdentifier: 'i-notstoppable',
          DBInstanceStatus: 'available',
          DBInstanceArn: 'arn:aws:rds:aws-region:aws-account:db:i-notstoppable',
          MultiAZ: false,
          ReadReplicaDBInstanceIdentifiers: [],
          ReadReplicaDBClusterIdentifiers: ['replica1'],
        }]
      };
      rdsMock
        .on(DescribeDBInstancesCommand)
        .resolves(mockDBInstances)
      const arns = await filterDBInstances('available');
      assert.deepEqual(arns, []);
    });
  });

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
});
