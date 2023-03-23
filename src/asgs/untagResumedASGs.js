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

  try {
    return retryWhenThrottled(() => autoscaling.deleteTags(params))
      .then(() => asg);
  }
  catch (err) {
    console.log('untagASG - Broken Throttling here:' + err + ' ASG is:' + asg);
    return err;
  }
}

function untagResumedASGs(asgs) {
  const untaggedASGs = asgs.map(asg => untagASG(asg));
  try {
    data = Promise.all(untaggedASGs);
    return data;
  }
    catch (err) {
      console.log('untagResumedASGs - Broken Promise here:' + err);
      return err;
  }
}

module.exports = untagResumedASGs;
