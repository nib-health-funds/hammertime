const AWS = require('aws-sdk');
const stopOneDBInstance = require('./stopOneDBInstance');

module.exports = function stopDBInstances(arns) {
  if (arns.length > 0) {
    console.log("Stopping RDS instances...");
    const arnsMap = arns.map(arn => stopOneDBInstance(arn));
    return Promise.all(arnsMap);
  } else {
    console.log("No RDS instances to stop... See you the next time...");
    return Promise.resolve([]);
  }
};
