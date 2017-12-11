const listTargetInstances = require('./listTargetInstances');

function listInstancesToStop(currentOperatingTimezone) {
  const params = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStop;
