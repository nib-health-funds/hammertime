'use strict';

const assert  = require('assert');
const asgs    = require('../src/asgs');
const AWS     = require('aws-sdk-mock');

describe('asgs', () => {

  describe('listASGsToStop()', () => {

    it('returns list of valid running asgs', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', stopOnePageResponse);

      return asgs.listASGsToStop()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 1);
          assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
        });
    });

    it('returns an empty list if no asgs found', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);

      return asgs.listASGsToStop()
        .then(validAsgs => {
          assert.deepEqual(validAsgs, []);
        });
    });

    it('handles pagination', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', function(params, callback) {
        callback(null, paginatedStop(params.NextToken));
      });

      return asgs.listASGsToStop()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 2);
          assert.equal(validAsgs.some(asg => {
            return asg.AutoScalingGroupName == 'can-touch-this-asg-page-1'
          }), true);
          assert.equal(validAsgs.some(asg => {
            return asg.AutoScalingGroupName == 'can-touch-this-asg-page-2'
          }), true);
        });
    });

    it('ignores asgs that are already stopped by hammertime', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', function(params, callback) {
        callback(null, stopAlreadyRunResponse);
      });

      return asgs.listASGsToStop()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 1);
          assert.equal(validAsgs.some(asg => {
            return asg.AutoScalingGroupName == 'can-touch-this-asg'
          }), true);
        });
    });

    afterEach(() => {
      AWS.restore('AutoScaling', 'describeAutoScalingGroups');
    });

  });

  describe('listASGsToStart()', () => {

    it('returns list of asgs spun down by hammertime', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', startOnePageResponse);

      return asgs.listASGsToStart()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 1);
          assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
        });
    });

    it('returns an empty list if no asgs found', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);
      return asgs.listASGsToStart()
        .then(validAsgs => {
          assert.deepEqual(validAsgs, []);
        });
    });

    it('handles pagination', () => {
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', function(params, callback) {
        callback(null, paginatedStart(params.NextToken));
      });

      return asgs.listASGsToStart()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 2);
          assert.equal(validAsgs.some(asg => {
            return asg.AutoScalingGroupName == 'can-touch-this-asg-page-1'
          }), true);
          assert.equal(validAsgs.some(asg => {
            return asg.AutoScalingGroupName == 'can-touch-this-asg-page-2'
          }), true);
        });
    });

    afterEach(() => {
      AWS.restore('AutoScaling', 'describeAutoScalingGroups');
    });

  });

});

function paginatedStop(nextToken) {
  return nextToken ? stopOnePageResponse : stopTwoPageResponse;
}

function paginatedStart(nextToken) {
  return nextToken ? startOnePageResponse : startTwoPageResponse;
}

const emptyResponse = { "AutoScalingGroups": [] };

const stopTwoPageResponse = {
  "AutoScalingGroups": [
    {
      "DesiredCapacity": 3,
      "Tags": [
        {
          Key: "hammertime:canttouchthis",
          Value: ""
        }
      ],
      "AutoScalingGroupName": "cant-touch-this-asg-page-1",
      "MinSize": 3,
      "MaxSize": 3
    },
    {
      "DesiredCapacity": 3,
      "Tags": [],
      "AutoScalingGroupName": "can-touch-this-asg-page-1",
      "MinSize": 3,
      "MaxSize": 3
    }
  ],
  "NextToken": "foobar"
};

const stopOnePageResponse = {
  "AutoScalingGroups": [
    {
      "DesiredCapacity": 3,
      "Tags": [
        {
          Key: "hammertime:canttouchthis",
          Value: ""
        }
      ],
      "AutoScalingGroupName": "cant-touch-this-asg-page-2",
      "MinSize": 3,
      "MaxSize": 3
    },
    {
      "DesiredCapacity": 3,
      "Tags": [],
      "AutoScalingGroupName": "can-touch-this-asg-page-2",
      "MinSize": 3,
      "MaxSize": 3
    }
  ],
  "NextToken": ""
};

const stopAlreadyRunResponse = {
  "AutoScalingGroups": [
    {
      "DesiredCapacity": 3,
      "Tags": [
        {
          Key: "hammertime:canttouchthis",
          Value: ""
        }
      ],
      "AutoScalingGroupName": "cant-touch-this-asg",
      "MinSize": 3,
      "MaxSize": 3
    },
    {
      "DesiredCapacity": 3,
      "Tags": [
        {
          Key: "stop:hammertime",
          Value: ""
        }
      ],
      "AutoScalingGroupName": "already-touched-this-asg",
      "MinSize": 3,
      "MaxSize": 3
    },
    {
      "DesiredCapacity": 3,
      "Tags": [],
      "AutoScalingGroupName": "can-touch-this-asg",
      "MinSize": 3,
      "MaxSize": 3
    }
  ],
  "NextToken": ""
};

const startTwoPageResponse = {
  "AutoScalingGroups": [
    {
      "AutoScalingGroupName": "cant-touch-this-asg-page-1",
      "MinSize": 0,
      "MaxSize": 0,
      "DesiredCapacity": 0,
      "Tags": [
        {
          Key: "hammertime:canttouchthis",
          Value: ""
        },
        {
          Key: "stop:hammertime",
          Value: ""
        },
        {
          Key: "hammertime:originalASGSize",
          Value: "1,1,1"
        }
      ],
    },
    {
      "AutoScalingGroupName": "can-touch-this-asg-page-1",
      "MinSize": 0,
      "MaxSize": 0,
      "DesiredCapacity": 0,
      "Tags": [
        {
          Key: "stop:hammertime",
          Value: ""
        },
        {
          Key: "hammertime:originalASGSize",
          Value: "1,1,1"
        }
      ]
    },
    {
      "AutoScalingGroupName": "untouched-asg-page-1",
      "MinSize": 1,
      "MaxSize": 3,
      "DesiredCapacity": 2,
      "Tags": []
    }
  ],
  "NextToken": "foobar"
};

const startOnePageResponse = {
  "AutoScalingGroups": [
    {
      "AutoScalingGroupName": "cant-touch-this-asg-page-2",
      "MinSize": 0,
      "MaxSize": 0,
      "DesiredCapacity": 0,
      "Tags": [
        {
          Key: "hammertime:canttouchthis",
          Value: ""
        },
        {
          Key: "stop:hammertime",
          Value: ""
        },
        {
          Key: "hammertime:originalASGSize",
          Value: "1,1,1"
        }
      ],
    },
    {
      "AutoScalingGroupName": "can-touch-this-asg-page-2",
      "MinSize": 0,
      "MaxSize": 0,
      "DesiredCapacity": 0,
      "Tags": [
        {
          Key: "stop:hammertime",
          Value: ""
        },
        {
          Key: "hammertime:originalASGSize",
          Value: "1,1,1"
        }
      ]
    },
    {
      "AutoScalingGroupName": "untouched-asg-page-2",
      "MinSize": 1,
      "MaxSize": 3,
      "DesiredCapacity": 2,
      "Tags": []
    }
  ],
  "NextToken": ""
};
