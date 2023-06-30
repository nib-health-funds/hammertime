const listTargetInstances = require('./listTargetInstances');

function listInstancesToStart(currentOperatingTimezone, application) {
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
      {
        Name: 'tag:aws:cloudformation:logical-id',
        Values: application,
      },      
      //TODO: This is for testing this is for testing 
      {
        Name: 'tag:Slice',
        Values: ['auto-w-2-c-636'],
      },      
      //TODO: This is for testing this is for testing 
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStart;
