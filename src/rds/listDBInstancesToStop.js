const filterDBInstances = require('./filterDBInstances.js');
const filterDBInstancesTaggedUntouchable = require('./filterDBInstancesTaggedUntouchable.js');

module.exports = function listDBInstancesToStop() {
  return filterDBInstances('available')
    .then(arns => {
      return filterDBInstancesTaggedUntouchable(arns);
    });
};
