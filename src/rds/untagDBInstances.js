const untagOneDBInstance = require('./untagOneDBInstance');

module.exports = function untagDBInstances(arns) {
  const arnsMap = arns.map(arn => untagOneDBInstance(arn));
  return Promise.all(arnsMap);
};
