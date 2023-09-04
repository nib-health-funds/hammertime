const assert = require('assert');
const { mockClient } = require('aws-sdk-client-mock');
const listInstancesToStop = require('../../src/instances/listInstancesToStop');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');

const ec2Mock = mockClient(EC2Client);

describe('listInstancesToStop()', () => {
  it('returns list of valid running instances', async () => {
    beforeEach(() => {
      ec2Mock.reset();
    });
  
    const mockInstances = {
      Reservations: [
        {
          Instances: [
            {
              InstanceId: 'i-instanceinanasg',
              Tags: [
                {
                  Key: 'aws:autoscaling:groupName',
                  Value: 'myapp-ECSAutoScalingGroup-ADSKJFKL2341',
                },
              ],
            },
          ],
        },
        {
          Instances: [
            {
              InstanceId: 'i-validinstance',
              Tags: [],
            },
          ],
        },
        {
          Instances: [
            {
              InstanceId: 'i-canttouchthis',
              Tags: [
                {
                  Key: 'hammertime:canttouchthis',
                  Value: '',
                },
              ],
            },
          ],
        },
      ],
    };
    ec2Mock
      .on(DescribeInstancesCommand)
      .resolves(mockInstances)
    const instanceIds = await listInstancesToStop(defaultOperatingTimezone);
    assert.deepEqual(instanceIds, ['i-validinstance']);
  });

  it('returns an empty list if no running instances found in aws', async () => {
    const mockInstances = {
      Reservations: [],
    };
    ec2Mock
      .on(DescribeInstancesCommand)
      .resolves(mockInstances)

    const instanceIds = await listInstancesToStop(defaultOperatingTimezone);
    assert.deepEqual(instanceIds, []);
  });
});
