const AWS = require('aws-sdk');

function tagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
        Value: new Date().toISOString(),
      },
    ],
  };
  const ec2 = new AWS.EC2();
  return ec2.createTags(options)
    .promise()
    .then(() => instanceIds);
}

module.exports = tagInstances;
