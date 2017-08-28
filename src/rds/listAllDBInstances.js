const AWS = require('aws-sdk');

module.exports = function listAllDBInstances() {
  return new Promise((resolve, reject) => {
    const rds = new AWS.RDS();
    rds.describeDBInstances()
      .promise()
      .then(data => resolve(data))
      .catch(reject);
  });
};
