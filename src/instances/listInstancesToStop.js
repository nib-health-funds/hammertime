const listTargetInstances = require('./listTargetInstances');

function listInstancesToStop() {
  const params = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
    ],
  };

  return listTargetInstances(params);
}

module.exports = listInstancesToStop;
