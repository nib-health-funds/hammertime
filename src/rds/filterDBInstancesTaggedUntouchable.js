const AWS = require('aws-sdk');
const notTaggedUntouchable = require('./notTaggedUntouchable.js');
const filterOutNulls = require('../utils/filterOutNulls.js');

module.exports = function filterDBInstancesTaggedUntouchable(arns) {
  const arnsMap = arns.map(arn => notTaggedUntouchable(arn));
  return Promise.all(arnsMap)
    .then(arns => filterOutNulls(arns));
};
