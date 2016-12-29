'use strict';

const AWS = require('aws-sdk');
const autoscaling = new AWS.AutoScaling();

function listInstancesToStop() {
  const ec2 = new AWS.EC2();
  const params = {
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['running']
        }
      ]
    }

  return new Promise((resolve, reject) => {
    ec2.describeInstances(params)
      .promise()
      .then(data => { resolve(filterInstances(data)); })
      .catch(err => { reject(err) });
  });
}

function filterInstances(data) {
  return data
          .Reservations
          .map(reservation => { return reservation.Instances })
          .reduce((prev, curr) => { return prev.concat(curr) })
          .filter(instanceCanBeStopped)
          .map(instance => { return instance.InstanceId })
}

function instanceCanBeStopped(instance) {
  return !instance.Tags.some(tag => { return (tag.Key === 'aws:autoscaling:groupName' || tag.Key === 'hammertime:canttouchthis') })
}

module.exports = { listInstancesToStop };
