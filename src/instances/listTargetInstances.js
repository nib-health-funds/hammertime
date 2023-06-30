const AWS = require('aws-sdk');
const canITouchThis = require('../tags/canITouchThis');
const hasTag = require('../tags/hasTag');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone');

function validInstance(instance) {
  return canITouchThis(instance.Tags) && !hasTag(instance.Tags, 'aws:autoscaling:groupName');
}

function isInstanceInCurrentOperatingTimezone(currentOperatingTimezone) {
  const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
  return instance => isInCurrentOperatingTimezone(instance.Tags);
}

function filterInstances(data, currentOperatingTimezone) {
  return data
    .Reservations
    .map(reservation => reservation.Instances)
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter(validInstance)
    .filter(isInstanceInCurrentOperatingTimezone(currentOperatingTimezone))
    .map(instance => instance.InstanceId);
}

function listTargetInstances(options) {
  const { params, currentOperatingTimezone } = options;
  const ec2 = new AWS.EC2();
  return ec2.describeInstances(params)
    .promise()
    .then(data => filterInstances(data, currentOperatingTimezone));
}

module.exports = listTargetInstances;
