const taggedHammertimeStop = require('./taggedHammertimeStop');
const filterOutNulls = require('../utils/filterOutNulls');

module.exports = function filterDBInstancesTaggedToStart(arns) {
  const arnsMap = arns.map(arn => taggedHammertimeStop(arn));
  return Promise.all(arnsMap)
    .then(_arns => filterOutNulls(_arns));
};
