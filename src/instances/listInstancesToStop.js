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
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStop;
