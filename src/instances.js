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

function listInstancesToStop() {
  const params = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
    ],
  };

  return listTargetInstances(params);
}

function listInstancesToStart() {
  const options = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['stopped'],
      },
      {
        Name: 'tag-key',
        Values: ['stop:hammertime'],
      },
    ],
  };

  return listTargetInstances(options);
}

function tagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
        Value: new Date().toISOString(),
      },
    ],
  };
  const ec2 = new AWS.EC2();
  return ec2.createTags(options)
    .promise()
    .then(() => instanceIds);
}

function untagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
      },
    ],
  };
  const ec2 = new AWS.EC2();
  return ec2.deleteTags(options)
    .promise()
    .then(() => instanceIds);
}

function stopInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return ec2.stopInstances({ InstanceIds: instanceIds })
    .promise()
    .then(() => instanceIds);
}

function startInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return ec2.startInstances({ InstanceIds: instanceIds })
    .promise()
    .then(() => instanceIds);
}

module.exports = {
  listInstancesToStop,
  listInstancesToStart,
  tagInstances,
  untagInstances,
  stopInstances,
  startInstances,
};
