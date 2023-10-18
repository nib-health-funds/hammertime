const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const createTag = require('../utils/createTag');

function tagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      createTag('hammertime:originalASGSize', asg.AutoScalingGroupName, 'auto-scaling-group', `${asg.MinSize},${asg.MaxSize},${asg.DesiredCapacity}`),
      createTag('stop:hammertime', asg.AutoScalingGroupName, 'auto-scaling-group', new Date().toISOString()),
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
