const AWS = require('aws-sdk');

function isASGroupNameTag(tag) {
  return tag.Key === 'aws:autoscaling:groupName';
}

function isCantTouchThisTag(tag) {
  return tag.Key === 'hammertime:canttouchthis';
}

function validInstance(instance) {
  return !instance.Tags.some(tag => (isASGroupNameTag(tag) || isCantTouchThisTag(tag)));
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
