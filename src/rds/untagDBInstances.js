const untagOneDBInstance = require('./untagOneDBInstance.js');

module.exports = function untagDBInstances(arns) {
  const arnsMap = arns.map(arn => untagOneDBInstance(arn));
  return Promise.all(arnsMap);
};
