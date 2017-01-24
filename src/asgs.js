'use strict';

module.exports = {
  listASGsToStop,
  listASGsToStart,
  tagASGs,
  untagASGs,
  stopASGs,
  startASGs
};

const AWS          = require('aws-sdk');
const promiseRetry = require('promise-retry');

function listASGsToStop() {
  return listTargetASGs(stoppableASG);
}

function listASGsToStart() {
  return listTargetASGs(startableASG);
}

function tagASGs(asgs) {
  const taggedASGs = asgs.map(asg => tagASG(asg));
  return Promise.all(taggedASGs);
}

function untagASGs(asgs) {
  const untaggedASGs = asgs.map(asg => untagASG(asg));
  return Promise.all(untaggedASGs);
}

function stopASGs(asgs) {
  const stoppedASGs = asgs.map(asg => spinDownASG(asg));
  return Promise.all(stoppedASGs);
}

function startASGs(asgs) {
  const startedASGs = asgs.map(asg => spinUpASG(asg));
  return Promise.all(startedASGs);
}

function listTargetASGs(filter) {
  return new Promise((resolve, reject) => {
    getAllASGs()
      .then(allASGs => {
        const filteredASGs = allASGs.filter(filter);
        resolve(filteredASGs);
      })
      .catch(reject);
  });
}

function getAllASGs() {
  const autoscaling = new AWS.AutoScaling();
  const params = {};

  return new Promise((resolve, reject) => {
    autoscaling.describeAutoScalingGroups(params)
      .promise()
      .then(data => {
        followPages(resolve, reject, [], data);
      })
      .catch(reject);
  });
}j

function followPages(resolve, reject, allAsgs, data) {
  const autoscaling = new AWS.AutoScaling();
  const params = {};

  allAsgs.push.apply(allAsgs, data.AutoScalingGroups);

  if (data.NextToken) {
    params.NextToken = data.NextToken;
    autoscaling.describeAutoScalingGroups(params)
      .promise()
      .then(res => {
        followPages(resolve, reject, allAsgs, res);
      })
      .catch(reject);
  } else {
    resolve(allAsgs)
  }
}

function stoppableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg, 'hammertime:canttouchthis')}`);
  return !hasTag(asg, 'stop:hammertime') && !hasTag(asg, 'hammertime:canttouchthis');
}

function startableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg, 'hammertime:canttouchthis')}`);
  return hasTag(asg, 'stop:hammertime') && !hasTag(asg, 'hammertime:canttouchthis');
}

function tagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
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
    ]
  };

  return new Promise((resolve, reject) => {
    promiseRetry((retry, number) => {
      return autoscaling.createOrUpdateTags(params)
        .promise()
        .catch(err => {
          if (err.code === 'Throttling') {
            console.warn(`Throttling the AWS API trying to tag ${asg.AutoScalingGroupName}. Backing off... (${number}/10)`);
            retry(err);
          }
          throw(err);
        });
    })
    .then(data => { resolve(asg) })
    .catch(reject);
  });
}

function untagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      {
        Key: 'hammertime:originalASGSize',
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group'
      },
      {
        Key: 'stop:hammertime',
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group'
      }
    ]
  };

  return new Promise((resolve, reject) => {
    promiseRetry((retry, number) => {
      return autoscaling.deleteTags(params)
        .promise()
        .catch(err => {
          if (err.code === 'Throttling') {
            console.warn(`Throttling the AWS API trying to untag ${asg.AutoScalingGroupName}. Backing off... (${number}/10)`);
            retry(err);
          }
          throw(err);
        });
    })
    .then(data => { resolve(asg) })
    .catch(reject);
  });
}

function spinDownASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    DesiredCapacity: 0,
    MinSize: 0,
  };

  return new Promise((resolve, reject) => {
    promiseRetry((retry, number) => {
      return autoscaling.updateAutoScalingGroup(params)
        .promise()
        .catch(err => {
          if (err.code === 'Throttling') {
            console.warn(`Throttling the AWS API trying to spin down ${asg.AutoScalingGroupName}. Backing off... (${number}/10)`);
            retry(err);
          }
          throw(err);
        });
    })
    .then(data => { resolve(asg) })
    .catch(reject);
  });
}

function spinUpASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const originalASGSize = valueForKey(asg.Tags, 'hammertime:originalASGSize').split(',');
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    MinSize: originalASGSize[0],
    MaxSize: originalASGSize[1],
    DesiredCapacity: originalASGSize[2],
  };

  return new Promise((resolve, reject) => {
    promiseRetry((retry, number) => {
      return autoscaling.updateAutoScalingGroup(params)
        .promise()
        .catch(err => {
          if (err.code === 'Throttling') {
            console.warn(`Throttling the AWS API trying to spin up ${asg.AutoScalingGroupName}. Backing off... (${number}/10)`);
            retry(err);
          }
          throw(err);
        });
    })
    .then(data => { resolve(asg) })
    .catch(reject);
  });
}

function hasTag(asg, target) {
  return asg.Tags.some(tag => {
    return (tag.Key === target);
  });
}

function valueForKey(tags, key) {
  return tags.find(tag => {
    return tag.Key === key
  }).Value;
}
