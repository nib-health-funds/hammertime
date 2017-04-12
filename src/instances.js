const AWS = require('aws-sdk');

function validInstance(instance) {
  return !instance.Tags.some(tag => (tag.Key === 'aws:autoscaling:groupName' || tag.Key === 'hammertime:canttouchthis'));
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
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();
    ec2.describeInstances(params)
      .promise()
      .then(data => resolve(filterInstances(data)))
      .catch(reject);
  });
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
  const params = {
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

  return listTargetInstances(params);
}

function tagInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  const params = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
        Value: new Date().toISOString(),
      },
    ],
  };

  return new Promise((resolve, reject) => {
    ec2.createTags(params)
      .promise()
      .then(() => resolve(instanceIds))
      .catch(err => reject(err));
  });
}

function untagInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  const params = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
      },
    ],
  };

  return new Promise((resolve, reject) => {
    ec2.deleteTags(params)
      .promise()
      .then(() => resolve(instanceIds))
      .catch(reject);
  });
}

function stopInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  const params = { InstanceIds: instanceIds };

  return new Promise((resolve, reject) => {
    ec2.stopInstances(params)
      .promise()
      .then(() => resolve(instanceIds))
      .catch(reject);
  });
}

function startInstances(instanceIds) {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();
    const params = { InstanceIds: instanceIds };

    ec2.startInstances(params)
      .promise()
      .then(() => resolve(instanceIds))
      .catch(reject);
  });
}

module.exports = {
  listInstancesToStop,
  listInstancesToStart,
  tagInstances,
  untagInstances,
  stopInstances,
  startInstances,
};
