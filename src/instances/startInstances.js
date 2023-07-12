const AWS = require('aws-sdk');
const retryWhenThrottled = require("../utils/retryWhenThrottled");

function startInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return retryWhenThrottled(() => ec2.startInstances({ InstanceIds: instanceIds }))
}

// return retryWhenThrottled(() => autoscaling.resumeProcesses(params))
// .then(() => asg);
// }

module.exports = startInstances;
