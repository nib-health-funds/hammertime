'use strict';

const assert         = require('assert');
const stopHammertime = require('../stop-hammertime');
const AWS            = require('aws-sdk-mock');

describe('stop-hammertime', () => {

  describe('stopEC2()', () => {

    it('should shut down valid instances only', () => {
      let mockInstances = {
        "Reservations": [
          {
            "Instances": [
              {
                "InstanceId": "i-aaaaaaaa",
                "Tags": [
                  {
                    "Key": "aws:autoscaling:groupName",
                    "Value": "myapp-ECSAutoScalingGroup-ADSKJFKL2341"
                  }
                ]
              }
            ]
          },
          {
            "Instances": [
              {
                "InstanceId": "i-bbbbbbbb",
                "Tags": []
              }
            ]
          },
          {
            "Instances": [
              {
                "InstanceId": "i-cccccccc",
                "Tags": [
                  {
                    "Key": "hammertime:canttouchthis",
                    "Value": ""
                  }
                ]
              }
            ]
          }
        ]
      };
      AWS.mock('EC2', 'describeInstances', mockInstances);
      AWS.mock('EC2', 'createTags', {});
      AWS.mock('EC2', 'stopInstances', {});

      return stopHammertime.stopEC2()
        .then(instances => {
          assert.deepEqual(instances, ['i-bbbbbbbb']);
        });
    });

  });

  describe('stopASG()', () => {

    it('should spin down valid ASGs only', () => {
      let mockASGs = {
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
        ]
      };
      AWS.mock('AutoScaling', 'describeAutoScalingGroups', mockASGs);
      AWS.mock('AutoScaling', 'createOrUpdateTags', {});
      AWS.mock('AutoScaling', 'updateAutoScalingGroup', {});

      return stopHammertime.stopASG()
        .then(asgs => {
          assert.deepEqual(asgs[0].AutoScalingGroupName, 'can-touch-this-asg');
        });
    });

  });

});
