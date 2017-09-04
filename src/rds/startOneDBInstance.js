const AWS = require('aws-sdk');

module.exports = function startOneDBInstance(arn) {
  const rds = new AWS.RDS();

  var instanceId = arn.split(':').pop();
  console.log("Starting "+instanceId+" ...");
  return new Promise((resolve, reject) => {
    return rds.startDBInstance({
        DBInstanceIdentifier: instanceId
      })
      .promise()
      .then(() => resolve(arn))
      .catch(reject);
  });
};
