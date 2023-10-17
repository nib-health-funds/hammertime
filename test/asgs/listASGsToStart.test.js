const assert = require('assert');
const { mockClient } = require('aws-sdk-client-mock');
const { AutoScalingClient, DescribeAutoScalingGroupsCommand } = require('@aws-sdk/client-auto-scaling');
const listASGsToStart = require('../../src/asgs/listASGsToStart');
const startOnePageResponse = require('./responses/startOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const startTwoPageResponse = require('./responses/startTwoPageResponse');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

const autoScalingMock = mockClient(AutoScalingClient);

describe('listASGsToStart()', () => {
  beforeEach(() => {
    autoScalingMock.reset();
  });

  it('returns list of asgs spun down by hammertime', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(startOnePageResponse)
    const validAsgs = await listASGsToStart(defaultOperatingTimezone);
    assert.equal(validAsgs.length, 1);
    assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
  });

  it('returns an empty list if no asgs found', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(emptyResponse)
    const validAsgs = await listASGsToStart(defaultOperatingTimezone);
    assert.deepEqual(validAsgs, []);
  });

  it('handles pagination', async () => {
    autoScalingMock
      .on(DescribeAutoScalingGroupsCommand)
      .resolvesOnce(startTwoPageResponse)
      .resolvesOnce(startOnePageResponse)
    const validAsgs = await listASGsToStart(defaultOperatingTimezone);
    assert.equal(validAsgs.length, 2);
    assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-1'), true);
    assert.equal(validAsgs.some(asg_1 => asg_1.AutoScalingGroupName === 'can-touch-this-asg-page-2'), true);
  });
});
