const listTargetInstances = require('./listTargetInstances');

function listInstancesToStop(currentOperatingTimezone, application) {
  const params = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['running'],
      },
      {
        Name: 'aws:cloudformation:stack-id',
        Values: application,
      },      
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStop;
