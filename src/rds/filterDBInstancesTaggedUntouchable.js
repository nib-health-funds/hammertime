const AWS = require('aws-sdk');
const notTaggedUntouchable = require('./notTaggedUntouchable');
const filterOutNulls = require('../utils/filterOutNulls');

module.exports = function filterDBInstancesTaggedUntouchable(arns) {
  const arnsMap = arns.map(arn => notTaggedUntouchable(arn));
  return Promise.all(arnsMap)
    .then(arns => filterOutNulls(arns));
};
