const listAllDBInstances = require('./listAllDBInstances');

function allStoppableDBInstances(instance) {
  return instance.DBInstanceStatus == 'available';
}

module.exports = function filterStoppableDBInstances() {
  return new Promise((resolve, reject) => {
    listAllDBInstances()
      .then(data => {
        resolve(data
          .DBInstances
          .filter(allStoppableDBInstances)
          .map(instance => instance.DBInstanceArn));
      })
      .catch(err => reject(err));
  });
}
