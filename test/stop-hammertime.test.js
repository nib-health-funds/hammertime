const assert         = require('assert');
const stopHammertime = require('../stop-hammertime');
const AWS            = require('aws-sdk-mock');

describe('stop-hammertime', () => {

  describe('listInstancesToStop()', () => {

    before(() => {
      const mockResponse = {
        "Reservations": [
          {
            "Instances": [
              {
                "InstanceId": "i-aaaaaaaa",
                "State": {
                  "Code": 16,
                  "Name": "running"
                },
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
                "State": {
                  "Code": 16,
                  "Name": "running"
                },
                "Tags": []
              }
            ]
          },
          {
            "Instances": [
              {
                "InstanceId": "i-cccccccc",
                "State": {
                  "Code": 16,
                  "Name": "running"
                },
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
      AWS.mock('EC2', 'describeInstances', mockResponse);
    });

    it('should return valid instances to shut down', () => {
      return stopHammertime.listInstancesToStop()
        .then(instances => {
          assert.deepEqual(instances, ['i-bbbbbbbb']);
        });
    });
  });

});
