const listTargetInstances = require('./listTargetInstances');

function listInstancesToStart() {
  const options = {
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

  return listTargetInstances(options);
}

module.exports = listInstancesToStart;
