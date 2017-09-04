const AWS = require('aws-sdk');

module.exports = function untagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    TagKeys: ['hammertime:stop']
  };
  return new Promise((resolve, reject) => {
    const rds = new AWS.RDS();
    rds.removeTagsFromResource(params)
      .promise()
      .then(() => resolve(arn))
      .catch(reject);
  });
};
