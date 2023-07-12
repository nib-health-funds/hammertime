const listTargetInstances = require("./listTargetInstances");

function listInstancesToStop(currentOperatingTimezone, application) {
  const params = {
    Filters: [
      {
        Name: "instance-state-name",
        Values: ["running"],
      },
      {
        Name: "tag:aws:cloudformation:logical-id",
        Values: application,
      },
      {
        Name: "tag:Slice",
        Values: ["w-2-c-680"],
      },      
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStop;
