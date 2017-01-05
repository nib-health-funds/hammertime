'use strict';

const AWS = require('aws-sdk');

function startEC2() {
  return new Promise((resolve, reject) => {
    listInstancesToStart()
      .then(startInstances)
      .then(removeTags)
      .then(resolve)
      .catch(reject);
  });
}

function startASG() {
  
}

function listInstancesToStart() {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();
    const params = {
      Filters: [
        {
          Name: 'instance-state-name',
          Values: ['stopped']
        },
        {
          Name: 'tag-key',
          Values: ['stop:hammertime']
        }
      ]
    };

    ec2.describeInstances(params)
      .promise()
      .then(data => { resolve(filterInstances(data)) })
      .catch(reject);
  });
}

function startInstances(instances) {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();
    const params = { InstanceIds: instances };

    ec2.startInstances(params)
      .promise()
      .then(data => { resolve(instances) })
      .catch(reject);
  });
}

function removeTags(instances) {
  return new Promise((reolve, reject) => {
    const ec2 = new AWS.EC2();
    const params = {
      Resources: instances,
      Tags: [
        {
          Key: 'stop:hammertime'
        }
      ]
    };

    ec2.deleteTags(params)
      .promise()
      .then(data => { resolve(instances) })
      .catch(reject);
  });
}

function filterInstances(data) {
  return data
          .Reservations
          .map(reservation => { return reservation.Instances })
          .reduce((prev, curr) => { return prev.concat(curr) })
          .filter(instanceCanBeStarted)
          .map(instance => { return instance.InstanceId });
}

function instanceCanBeStarted(instance) {
  return !instance.Tags.some(tag => {
    return (tag.Key === 'aws:autoscaling:groupName');
  });
}

module.exports = { startEC2, startASG };
