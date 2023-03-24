const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const createTag = require('../utils/createTag');

function untagASG(asg) {
  console.log('Calling untagASG: ASG is:' + asg);
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      createTag('stop:hammertime', asg.AutoScalingGroupName, 'auto-scaling-group'),
    ],
  };
  console.log('Calling untagASG: Tag params are:' + params);

  return retryWhenThrottled(() => autoscaling.deleteTags(params))
    .then(() => asg);

}

function untagResumedASGs(asgs) {
  const untaggedASGs = asgs.map(asg => untagASG(asg));
  try {
    return Promise.all(untaggedASGs);
  }
    catch (err) {
      console.log('untagResumedASGs - Broken Promise here:' + err);
      return err;
  }
}

module.exports = untagResumedASGs;
