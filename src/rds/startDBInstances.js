const AWS = require('aws-sdk');
const startOneDBInstance = require('./startOneDBInstance');

module.exports = function startDBInstances(arns) {
  if (arns.length > 0) {
    console.log("Starting RDS instances...");
    const arnsMap = arns.map(arn => startOneDBInstance(arn));
    return Promise.all(arnsMap);
  } else {
    console.log("No RDS instances to start... See you the next time...");
    return Promise.resolve([]);
  }
};
