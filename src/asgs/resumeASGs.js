const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function resumeASGProcesses(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    ScalingProcesses: []
  };

  return retryWhenThrottled(() => autoscaling.suspendProcesses(params))
    .then(() => asg);
}

function resumeASGs(asgs) {
  const updatedASGs = asgs.map(asg => resumeASGProcesses(asg));
  return Promise.all(updatedASGs);
}

module.exports = resumeASGs;
