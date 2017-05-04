const AWS = require('aws-sdk');

function stopInstances(instanceIds) {
  const ec2 = new AWS.EC2();
  return ec2.stopInstances({ InstanceIds: instanceIds })
    .promise()
    .then(() => instanceIds);
}

module.exports = stopInstances;
