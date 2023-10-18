const filterDBInstances = require('./filterDBInstances');
const filterDBInstancesTaggedUntouchable = require('./filterDBInstancesTaggedUntouchable');

module.exports = function listDBInstancesToStop() {
  return filterDBInstances('available')
    .then(arns => {
      return filterDBInstancesTaggedUntouchable(arns);
    });
};
