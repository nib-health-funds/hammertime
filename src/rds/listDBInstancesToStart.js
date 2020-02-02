const filterDBInstances = require('./filterDBInstances.js');
const filterDBInstancesTaggedToStart = require('./filterDBInstancesTaggedToStart.js');

module.exports = function listDBInstancesToStart() {
  return filterDBInstances('stopped')
    .then(arns => filterDBInstancesTaggedToStart(arns));
};
