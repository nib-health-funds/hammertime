const assert          = require('assert');
const startHammertime = require('../start-hammertime');
const AWS             = require('aws-sdk-mock');

describe('start-hammertime', () => {

  describe('startEC2()', () => {

    it('should start stopped, tagged instances', () => {

      const mockInstances = {
        "Reservations": [
          {
            "Instances": [
              {
                "InstanceId": "i-inanasg",
                "Tags": [
                  {
                    "Key": "aws:autoscaling:groupName",
                    "Value": "myapp-ECSAutoScalingGroup-ADSKJFKL2341"
                  },
                  {
                    "Key": "stop:hammertime",
                    "Value": ""
                  }
                ]
              }
            ]
          },
          {
            "Instances": [
              {
                "InstanceId": "i-validinstance",
                "Tags": [
                  {
                    "Key": "stop:hammertime",
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

    })

  });

});
