const AWS = require('aws-sdk');
const stopOneDBInstance = require('./stopOneDBInstance');

module.exports = function stopDBInstances(arns) {
  const arnsMap = arns.map(arn => stopOneDBInstance(arn));
  return Promise.all(arnsMap);
};
