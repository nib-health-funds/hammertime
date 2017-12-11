const AWS = require('aws-sdk');

module.exports = function untagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    TagKeys: ['hammertime:stop']
  };
  const rds = new AWS.RDS();
  return rds.removeTagsFromResource(params)
    .promise()
    .then(() => arn);
};
