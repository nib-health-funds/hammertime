const AWS = require('aws-sdk');

module.exports = function tagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    Tags: [{
      Key: 'hammertime:stop',
      Value: new Date().toISOString()
    }]
  };
  return new Promise((resolve, reject) => {
    const rds = new AWS.RDS();
    rds.addTagsToResource(params)
      .promise()
      .then(() => resolve(arn))
      .catch(reject);
  });
};
