const AWS = require('aws-sdk');

module.exports =function stopOneDBInstance(arn) {
  const rds = new AWS.RDS();

  var instanceId = arn.split(':').pop();
  console.log("Stopping "+instanceId+"...");
  return new Promise((resolve, reject) => {
    return rds.stopDBInstance({
        DBInstanceIdentifier: instanceId
      })
      .promise()
      .then(() => resolve(arn))
      .catch(reject);
  });
};
