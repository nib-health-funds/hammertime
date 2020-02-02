const listTargetInstances = require('./listTargetInstances.js');

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
