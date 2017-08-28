const listAllDBInstances = require('./listAllDBInstances');

function allStartableDBInstances(instance) {
  return instance.DBInstanceStatus == 'stopped';
};

module.exports = function filterStartableDBInstances() {
  return new Promise((resolve, reject) => {
    listAllDBInstances()
      .then(data => {
        resolve(data
          .DBInstances
          .filter(allStartableDBInstances)
          .map(instance => instance.DBInstanceArn));
      })
      .catch(err => reject(err));
  });
};
