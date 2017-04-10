const AWS = require('aws-sdk');

function untagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
      },
    ],
  };
  const ec2 = new AWS.EC2();
  return ec2.deleteTags(options)
    .promise()
    .then(() => instanceIds);
}

module.exports = untagInstances;
