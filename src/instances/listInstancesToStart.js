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
      {
        Name: "tag:Slice",
        Values: ["w-2-c-680"],
      },      
    ],
  };

  return listTargetInstances({ params, currentOperatingTimezone });
}

module.exports = listInstancesToStart;
