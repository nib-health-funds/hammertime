const listTargetInstances = require("./listTargetInstances");

function listInstancesToStart(currentOperatingTimezone, application) {
  const params = {
    Filters: [
      {
        Name: "instance-state-name",
        Values: ["stopped"],
      },
      {
        Name: "tag-key",
        Values: ["stop:hammertime"],
      },
      {
        Name: "tag:aws:cloudformation:logical-id",
        Values: application,
      },
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStart;
