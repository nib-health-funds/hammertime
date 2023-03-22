const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const createTag = require('../utils/createTag');

function untagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      createTag('stop:hammertime', asg.AutoScalingGroupName, 'auto-scaling-group'),
    ],
  };

  return retryWhenThrottled(() => autoscaling.deleteTags(params))
    .then(() => asg);
}

function untagResumedASGs(asgs) {
  const untaggedASGs = asgs.map(asg => untagASG(asg));
  try {
    data = Promise.all(untaggedASGs);
  }
    catch (err) {
      console.log('untagResumedASGs - Broken Promise here:');
      console.log(err);
      return err;
  }
  return data
}

module.exports = untagResumedASGs;
