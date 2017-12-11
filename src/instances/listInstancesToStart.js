const listTargetInstances = require('./listTargetInstances');

function listInstancesToStart(currentOperatingTimezone) {
  const params = {
    Filters: [
      {
        Name: 'instance-state-name',
        Values: ['stopped'],
      },
      {
        Name: 'tag-key',
        Values: ['stop:hammertime'],
      },
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStart;
