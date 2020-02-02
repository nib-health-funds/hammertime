const listAllDBInstances = require('./listAllDBInstances.js');
const allValidDBInstances = require('./allValidDBInstances.js');

module.exports = function filterDBInstances(status) {
  return listAllDBInstances()
    .then(data => {
      return data
        .DBInstances
        .filter(allValidDBInstances, status)
        .map(instance => instance.DBInstanceArn);
    });
}
