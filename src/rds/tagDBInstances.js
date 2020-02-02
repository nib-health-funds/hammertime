const tagOneDBInstance = require('./tagOneDBInstance.js');

module.exports = function tagDBInstances(arns) {
  const arnsMap = arns.map(arn => tagOneDBInstance(arn));
  return Promise.all(arnsMap);
};
