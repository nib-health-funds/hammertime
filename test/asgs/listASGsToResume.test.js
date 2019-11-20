const assert = require('assert');
const AWS = require('aws-sdk-mock');
const listASGsToResume = require('../../src/asgs/listASGsToResume');
const resumeOnePageResponse = require('./responses/resumeOnePageResponse');
const emptyResponse = require('./responses/emptyResponse');
const paginatedResume = require('./responses/paginatedResume');
const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

describe('listASGsToResume()', () => {
  it('returns list of asgs suspended by hammertime', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', resumeOnePageResponse);

    return listASGsToResume(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.equal(validAsgs.length, 1);
        assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
      });
  });

  it('returns an empty list if no asgs found', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);
    return listASGsToResume(defaultOperatingTimezone)
      .then((validAsgs) => {
        assert.deepEqual(validAsgs, []);
      });
  });

  it('handles pagination', () => {
    AWS.mock('AutoScaling', 'describeAutoScalingGroups', (params, callback) => {
      callback(null, paginatedResume(params.NextToken));
    });

    return listASGsToResume(defaultOperatingTimezone)
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
