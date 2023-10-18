const filterDBInstances = require('./filterDBInstances');
const filterDBInstancesTaggedToStart = require('./filterDBInstancesTaggedToStart');

module.exports = function listDBInstancesToStart() {
  return filterDBInstances('stopped')
    .then(arns => filterDBInstancesTaggedToStart(arns));
};
