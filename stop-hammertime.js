'use strict';

const AWS = require('aws-sdk');

function stopEC2() {
  return new Promise((resolve, reject) => {
    listInstancesToStop()
      .then(tagStopTime)
      .then(stopInstances)
      .then(resolve)
      .catch(reject);
  });
}

function stopASG() {
  return new Promise((resolve, reject) => {
    listASGsToStop()
      .then(tagASGs)
      .then(stopASGs)
      .then(resolve)
      .catch(reject);
  });
}

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
      .then(data => { resolve(filterInstances(data)) })
      .catch(reject);
  });
}

function listASGsToStop() {
  const autoscaling = new AWS.AutoScaling();
  return new Promise((resolve, reject) => {
    autoscaling.describeAutoScalingGroups()
      .promise()
      .then(data => { resolve(filterASGs(data)) })
      .catch(err => { reject(err) });
  });
}

function tagStopTime(resources) {
  const ec2 = new AWS.EC2();
  const params = {
      Resources: resources,
      Tags: [
        {
          Key: 'stop:hammertime',
          Value: new Date().toISOString()
        }
      ]
    }
    return new Promise((resolve, reject) => {
      ec2.createTags(params)
        .promise()
        .then(data => { resolve(resources) })
        .catch(err => { reject(err) });
    });
}

function tagASGs(asgs) {
  const taggedASGs = asgs.map(asg => {
    return tagStopTimeAndSize(asg);
  });
  return Promise.all(taggedASGs);
}

function stopASGs(asgs) {
  const stoppedASGs = asgs.map(asg => {
    return spinDownASG(asg);
  });
  return Promise.all(stoppedASGs);
}

function tagStopTimeAndSize(asg) {
  return new Promise((resolve, reject) => {
    const autoscaling = new AWS.AutoScaling();
    const tags = [
      {
        Key: 'hammertime:originalASGSize',
        PropagateAtLaunch: false,
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
        Value: `${asg.MinSize},${asg.MaxSize},${asg.DesiredCapacity}`
      },
      {
        Key: 'stop:hammertime',
        PropagateAtLaunch: false,
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
        Value: new Date().toISOString()
      }
    ];
    const params = { Tags: tags };

    autoscaling.createOrUpdateTags(params)
      .promise()
      .then(data => { resolve(asg) })
      .catch(err => { reject(err) });
  });
}

function stopInstances(instances) {
  return new Promise((resolve, reject) => {
    const ec2 = new AWS.EC2();
    const params = { InstanceIds: instances };

    ec2.stopInstances(params)
      .promise()
      .then(data => { resolve(instances) })
      .catch(reject);
  });
}

function spinDownASG(asg) {
  return new Promise((resolve, reject) => {
    const autoscaling = new AWS.AutoScaling();
    const params = {
      AutoScalingGroupName: asg.AutoScalingGroupName,
      DesiredCapacity: 0,
      MinSize: 0,
    };

    autoscaling.updateAutoScalingGroup(params)
      .promise()
      .then(data => { resolve(asg) })
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

function filterASGs(data) {
  return data.AutoScalingGroups.filter(asgCanBeStopped);
}

function instanceCanBeStopped(instance) {
  return !instance.Tags.some(tag => {
    return (tag.Key === 'aws:autoscaling:groupName' || tag.Key === 'hammertime:canttouchthis');
  });
}

function asgCanBeStopped(asg) {
  return !asg.Tags.some(tag => {
    return (tag.Key === 'hammertime:canttouchthis');
  });
}

module.exports = { stopEC2, stopASG };
