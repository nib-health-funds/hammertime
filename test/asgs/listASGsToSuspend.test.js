const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listASGsToSuspend = require('../../src/asgs/listASGsToSuspend');
const suspendOnePageResponse = require('./responses/suspendOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const suspendAlreadyRunResponse = require('./responses/suspendAlreadyRunResponse');
const paginatedSuspend = require('./responses/paginatedSuspend');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

describe('listASGsToSuspend()', () => {
  it('returns list of valid running asgs', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', suspendOnePageResponse);

    return listASGsToSuspend(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
      });
  });

  it('returns an empty list if no asgs found', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);

    return listASGsToSuspend(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.deepEqual(validAsgs, []);
      });
  });

  it('handles pagination', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, paginatedSuspend(params.NextToken));
    });

    return listASGsToSuspend(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 2);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-1'), true);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-2'), true);
      });
  });

  it('ignores asgs that are already suspendped by hammertime', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, suspendAlreadyRunResponse);
    });

    return listASGsToSuspend(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg'), true);
      });
  });

  afterEach(() => {
    AWS.restore('AutoScaling', 'describeAutoScalingGroups');
  });
});
