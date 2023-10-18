const AWS = require('aws-sdk');

module.exports = function listAllDBInstances() {
  const rds = new AWS.RDS();
  return rds.describeDBInstances().promise();
};
