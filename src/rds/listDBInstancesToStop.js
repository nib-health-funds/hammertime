const filterStoppableDBInstances = require('./filterStoppableDBInstances');
const filterDBInstancesTaggedUntouchable = require('./filterDBInstancesTaggedUntouchable');

module.exports = function listDBInstancesToStop() {
  return new Promise((resolve, reject) => {
    filterStoppableDBInstances()
      .then(arns => filterDBInstancesTaggedUntouchable(arns))
      .then(arns => resolve(arns))
      .catch(reject);
  });
};
