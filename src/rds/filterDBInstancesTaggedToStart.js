const taggedHammertimeStop = require('./taggedHammertimeStop.js');
const filterOutNulls = require('../utils/filterOutNulls.js');

module.exports = function filterDBInstancesTaggedToStart(arns) {
  const arnsMap = arns.map(arn => taggedHammertimeStop(arn));
  return Promise.all(arnsMap)
    .then(_arns => filterOutNulls(_arns));
};
