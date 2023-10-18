const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function spinDownASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    DesiredCapacity: 0,
    MinSize: 0,
  };

  return retryWhenThrottled(() => autoscaling.updateAutoScalingGroup(params))
    .then(() => asg);
}

function stopASGs(asgs) {
  const stoppedASGs = asgs.map(asg => spinDownASG(asg));
  return Promise.all(stoppedASGs);
}

module.exports = stopASGs;
