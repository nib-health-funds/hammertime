'use strict';

const assert = require('assert');
const asgs   = require('../src/asgs');
const AWS    = require('aws-sdk-mock');

describe('asgs', () => {

  describe('listASGsToStop()', () => {

    it('returns list of valid running asgs', () => {
      const mockASGs = {
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
            "Tags": [],
            "AutoScalingGroupName": "can-touch-this-asg",
            "MinSize": 3,
            "MaxSize": 3
          }
        ],
        "NextToken": ""
      };
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', mockASGs);

      return asgs.listASGsToStop()
        .then(validAsgs => {
          // assert.equal(validAsgs.length, 1);
          assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg');
        });
    });

    it('returns an empty list if no asgs found', () => {
      const mockASGs = { "AutoScalingGroups": [] };
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', mockASGs);

      return asgs.listASGsToStop()
        .then(validAsgs => {
          assert.deepEqual(validAsgs, []);
        });
    });

    afterEach(() => {
      AWS.restore('AutoScaling', 'describeAutoScalingGroups');
    });

  });

  describe('listASGsToStart()', () => {

    it('returns list of asgs spun down by hammertime', () => {
      const mockASGs = {
        "AutoScalingGroups": [
          {
            "AutoScalingGroupName": "cant-touch-this-asg",
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
            "AutoScalingGroupName": "can-touch-this-asg",
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
            "AutoScalingGroupName": "untouched-asg",
            "MinSize": 1,
            "MaxSize": 3,
            "DesiredCapacity": 2,
            "Tags": []
          }
        ]
      };
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', mockASGs);

      return asgs.listASGsToStart()
        .then(validAsgs => {
          assert.equal(validAsgs.length, 1);
          assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg');
        });
    });

    it('returns an empty list if no asgs found', () => {
      const mockASGs = { "AutoScalingGroups": [] };
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', mockASGs);

      return asgs.listASGsToStart()
        .then(validAsgs => {
          assert.deepEqual(validAsgs, []);
        });
    });

    afterEach(() => {
      AWS.restore('AutoScaling', 'describeAutoScalingGroups');
    });

  });

});
