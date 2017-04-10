const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function untagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      {
        Key: 'hammertime:originalASGSize',
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
      },
      {
        Key: 'stop:hammertime',
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
      },
    ],
  };

  return retryWhenThrottled(() => autoscaling.deleteTags(params))
    .then(() => asg);
}

function untagASGs(asgs) {
  const untaggedASGs = asgs.map(asg => untagASG(asg));
  return Promise.all(untaggedASGs);
}

module.exports = untagASGs;
