const notTaggedUntouchable = require('./notTaggedUntouchable');
const filterOutNulls = require('../utils/filterOutNulls');

module.exports = async function filterDBInstancesTaggedUntouchable(arns) {
  const arnsMap = arns.map((arn) => notTaggedUntouchable(arn));
  const arns_1 = await Promise.all(arnsMap);
  return filterOutNulls(arns_1);
};
