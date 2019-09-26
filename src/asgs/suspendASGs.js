const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function suspendASGProcesses(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    ScalingProcesses: [
      "Launch",
      "Terminate",
      "HealthCheck"
    ]
  };

  return retryWhenThrottled(() => autoscaling.suspendProcesses(params))
    .then(() => asg);
}

function suspendASGs(asgs) {
  const updatedASGs = asgs.map(asg => suspendASGProcesses(asg));
  return Promise.all(updatedASGs);
}

module.exports = suspendASGs;
