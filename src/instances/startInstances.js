const AWS = require('aws-sdk');

function startInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return retryWhenThrottled(() => ec2.startInstances({ InstanceIds: instanceIds }))
    .promise()
    .then(() => instanceIds);
}

// return retryWhenThrottled(() => autoscaling.resumeProcesses(params))
// .then(() => asg);
// }

module.exports = startInstances;
