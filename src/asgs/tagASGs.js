const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function tagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      {
        Key: 'hammertime:originalASGSize',
        PropagateAtLaunch: false,
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
        Value: `${asg.MinSize},${asg.MaxSize},${asg.DesiredCapacity}`,
      },
      {
        Key: 'stop:hammertime',
        PropagateAtLaunch: false,
        ResourceId: asg.AutoScalingGroupName,
        ResourceType: 'auto-scaling-group',
        Value: new Date().toISOString(),
      },
    ],
  };

  return retryWhenThrottled(() => autoscaling.createOrUpdateTags(params))
    .then(() => asg);
}

function tagASGs(asgs) {
  const taggedASGs = asgs.map(asg => tagASG(asg));
  return Promise.all(taggedASGs);
}

module.exports = tagASGs;
