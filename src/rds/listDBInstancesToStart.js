const filterStartableDBInstances = require('./filterStartableDBInstances');
const filterDBInstancesTaggedToStart = require('./filterDBInstancesTaggedToStart');

module.exports = function listDBInstancesToStart() {
  return new Promise((resolve, reject) => {
    filterStartableDBInstances()
      .then(arns => filterDBInstancesTaggedToStart(arns))
      .then(arns => resolve(arns))
      .catch(reject);
  });
};
