const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listInstancesToStop = require('../../src/instances/listInstancesToStop');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

describe('listInstancesToStop()', () => {
  it('returns list of valid running instances', () => {
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
    AWS.mock('EC2', 'describeInstances', mockInstances);
    return listInstancesToStop(defaultOperatingTimezone)
      .then((instanceIds) => {
        assert.deepEqual(instanceIds, ['i-validinstance']);
      });
  });

  it('returns an empty list if no running instances found in aws', () => {
    const mockInstances = {
      Reservations: [],
    };
    AWS.mock('EC2', 'describeInstances', mockInstances);

    return listInstancesToStop(defaultOperatingTimezone)
      .then((instanceIds) => {
        assert.deepEqual(instanceIds, []);
      });
  });

  afterEach(() => {
    AWS.restore('EC2', 'describeInstances');
  });
});
