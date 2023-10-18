const listAllDBInstances = require('./listAllDBInstances');
const allValidDBInstances = require('./allValidDBInstances');

module.exports = function filterDBInstances(status) {
  return listAllDBInstances()
    .then(data => {
      return data
        .DBInstances
        .filter(allValidDBInstances, status)
        .map(instance => instance.DBInstanceArn);
    });
}
