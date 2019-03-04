const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listASGsToStop = require('../../src/asgs/listASGsToStop');
const stopOnePageResponse = require('./responses/stopOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const stopAlreadyRunResponse = require('./responses/stopAlreadyRunResponse');
const paginatedStop = require('./responses/paginatedStop');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

describe('listASGsToStop()', () => {
  it('returns list of valid running asgs', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', stopOnePageResponse);

    return listASGsToStop(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
      });
  });

  it('returns an empty list if no asgs found', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);

    return listASGsToStop(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.deepEqual(validAsgs, []);
      });
  });

  it('handles pagination', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, paginatedStop(params.NextToken));
    });

    return listASGsToStop(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 2);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-1'), true);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-2'), true);
      });
  });

  it('ignores asgs that are already stopped by hammertime', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, stopAlreadyRunResponse);
    });

    return listASGsToStop(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg'), true);
      });
  });

  afterEach(() => {
    AWS.restore('AutoScaling', 'describeAutoScalingGroups');
  });
});
