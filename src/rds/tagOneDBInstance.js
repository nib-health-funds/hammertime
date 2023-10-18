const AWS = require('aws-sdk');

module.exports = function tagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    Tags: [{
      Key: 'hammertime:stop',
      Value: new Date().toISOString()
    }]
  };
  const rds = new AWS.RDS();
  return rds.addTagsToResource(params)
    .promise()
    .then(() => arn);
};
