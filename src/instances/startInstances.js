const AWS = require('aws-sdk');

function startInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return ec2.startInstances({ InstanceIds: instanceIds })
    .promise()
    .then(() => instanceIds);
}

module.exports = startInstances;
