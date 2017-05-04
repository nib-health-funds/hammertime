const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listInstancesToStart = require('../../src/instances/listInstancesToStart');

describe('listInstancesToStart()', () => {
  it('returns list of valid instances stopped by hammertime', () => {
    const mockInstances = {
      Reservations: [
        {
          Instances: [
            {
              InstanceId: 'i-stoppedbutcanttouchthis',
              Tags: [
                {
                  Key: 'hammertime:canttouchthis',
                  Value: '',
                },
                {
                  Key: 'stop:hammertime',
                  Value: '',
                },
              ],
            },
          ],
        },
        {
          Instances: [
            {
              InstanceId: 'i-validinstance',
              Tags: [
                {
                  Key: 'stop:hammertime',
                  Value: '',
                },
              ],
            },
          ],
        },
      ],
    };
    AWS.mock('EC2', 'describeInstances', mockInstances);
    return listInstancesToStart()
      .then((instanceIds) => {
        console.log(instanceIds);
        assert.deepEqual(instanceIds, ['i-validinstance']);
      });
  });

  afterEach(() => {
    AWS.restore('EC2', 'describeInstances');
  });
});
