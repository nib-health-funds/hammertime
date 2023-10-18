const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listASGsToStart = require('../../src/asgs/listASGsToStart');
const startOnePageResponse = require('./responses/startOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const paginatedStart = require('./responses/paginatedStart');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

describe('listASGsToStart()', () => {
  it('returns list of asgs spun down by hammertime', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', startOnePageResponse);

    return listASGsToStart(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
      });
  });

  it('returns an empty list if no asgs found', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);
    return listASGsToStart(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.deepEqual(validAsgs, []);
      });
  });

  it('handles pagination', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, paginatedStart(params.NextToken));
    });

    return listASGsToStart(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 2);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-1'), true);
        assert.equal(validAsgs.some(asg => asg.AutoScalingGroupName === 'can-touch-this-asg-page-2'), true);
      });
  });

  afterEach(() => {
    AWS.restore('AutoScaling', 'describeAutoScalingGroups');
  });
});
