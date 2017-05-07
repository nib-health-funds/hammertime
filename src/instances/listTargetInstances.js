const AWS = require('aws-sdk');
const canITouchThis = require('../tags/canITouchThis');

function isASGroupNameTag(tag) {
  return tag.Key === 'aws:autoscaling:groupName';
}

function validInstance(instance) {
  return canITouchThis(instance.Tags) && !instance.Tags.some(isASGroupNameTag);
}

function filterInstances(data) {
  return data
    .Reservations
    .map(reservation => reservation.Instances)
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter(validInstance)
    .map(instance => instance.InstanceId);
}

function listTargetInstances(params) {
  const ec2 = new AWS.EC2();
  return ec2.describeInstances(params)
    .promise()
    .then(data => filterInstances(data));
}

module.exports = listTargetInstances;
