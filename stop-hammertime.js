'use strict';

const AWS = require('aws-sdk');

const ec2 = new AWS.EC2();
const autoscaling = new AWS.AutoScaling();

function findInstances() {
  return new Promise((resolve, reject) => {
    listRunningInstances()
      .then(runningInstances => { return filterByIgnoreTag(runningInstances); })
      .then(filteredInstances => { return tagInstances(filteredInstances); })
      .then(taggedInstances => { return stopInstances(taggedInstances); })
      .catch(error => {
        reject(error);
        console.error(error);
      });
  });
}

function listRunningInstances() {
  const params = {
    DryRun: false,
    Filters: [{
      Name: 'instance-state-name',
      Values: ['running']
    }]
  };

  return new Promise((resolve, reject) => {
    console.log("Looking for solitary instances to shut down...");

  });
}

module.exports = { listRunningInstances };
