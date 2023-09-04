const assert = require('assert');
const { mockClient } = require('aws-sdk-client-mock');
const { AutoScalingClient, DescribeAutoScalingGroupsCommand } = require('@aws-sdk/client-auto-scaling');
const listASGsToStop = require('../../src/asgs/listASGsToStop');
const stopOnePageResponse = require('./responses/stopOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const stopAlreadyRunResponse = require('./responses/stopAlreadyRunResponse');
const stopTwoPageResponse = require('./responses/stopTwoPageResponse');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

const autoScalingMock = mockClient(AutoScalingClient);

describe('listASGsToStop()', () => {
  beforeEach(() => {
    autoScalingMock.reset();
  });

  it('returns list of valid running asgs', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(stopOnePageResponse)

    const validAsgs = await listASGsToStop(defaultOperatingTimezone);
    assert.equal(validAsgs.length, 1);
    assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
  });

  it('returns an empty list if no asgs found', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(emptyResponse)

    const validAsgs = await listASGsToStop(defaultOperatingTimezone);
    assert.deepEqual(validAsgs, []);
  });

  it('handles pagination', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(stopTwoPageResponse)
      .resolvesOnce(stopOnePageResponse)

    const validAsgs = await listASGsToStop(defaultOperatingTimezone);
    assert.equal(validAsgs.length, 2);
    assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-1'), true);
    assert.equal(validAsgs.some(asg_1 => asg_1.AutoScalingGroupName === 'can-touch-this-asg-page-2'), true);
  });

  it('ignores asgs that are already stopped by hammertime', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(stopAlreadyRunResponse)

    const validAsgs = await listASGsToStop(defaultOperatingTimezone);
    assert.equal(validAsgs.length, 1);
    assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg'), true);
  });
});
