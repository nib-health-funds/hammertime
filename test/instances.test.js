'use strict';

const assert    = require('assert');
const instances = require('../src/instances');
const AWS       = require('aws-sdk-mock');

describe('instances', () => {

  describe('listInstancesToStop()', () => {

    it('returns list of valid running instances', () => {
      const mockInstances = {
        "Reservations": [
          {
            "Instances": [
              {
                "InstanceId": "i-instanceinanasg",
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
                "InstanceId": "i-validinstance",
                "Tags": []
              }
            ]
          },
          {
            "Instances": [
              {
                "InstanceId": "i-canttouchthis",
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
      return instances.listInstancesToStop()
        .then(instanceIds => {
          assert.deepEqual(instanceIds, ['i-validinstance']);
        });
    });

    it('returns an empty list if no running instances found in aws', () => {
      const mockInstances = {
          "Reservations": []
        }
      AWS.mock('EC2', 'describeInstances', mockInstances);

      return instances.listInstancesToStop()
        .then(instanceIds => {
          assert.deepEqual(instanceIds, []);
        });
    });

    afterEach(() => {
      AWS.restore('EC2', 'describeInstances');
    });

  });

  describe('listInstancesToStart()', () => {

    it('returns list of valid instances stopped by hammertime', () => {
      const mockInstances = {
        "Reservations": [
          {
            "Instances": [
              {
                "InstanceId": "i-stoppedbutcanttouchthis",
                "Tags": [
                  {
                    "Key": "hammertime:canttouchthis",
                    "Value": ""
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
      return instances.listInstancesToStop()
        .then(instanceIds => {
          assert.deepEqual(instanceIds, ['i-validinstance']);
        });
    });

    afterEach(() => {
      AWS.restore('EC2', 'describeInstances');
    });

  });

});
