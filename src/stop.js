const stopASGs = require("./asgs/stopASGs");
const listASGsToStop = require("./asgs/listASGsToStop");
const tagASGs = require("./asgs/tagASGs");
const suspendASGs = require("./asgs/suspendASGs");
const listASGsToSuspend = require("./asgs/listASGsToSuspend");
const tagSuspendedASGs = require("./asgs/tagSuspendedASGs");
const listInstancesToStop = require("./instances/listInstancesToStop");
const tagInstances = require("./instances/tagInstances");
const stopInstances = require("./instances/stopInstances");
const listDBInstancesToStop = require("./rds/listDBInstancesToStop");
const stopDBInstances = require("./rds/stopDBInstances");
const tagDBInstances = require("./rds/tagDBInstances");
const listServicesToStop = require("./ecs/listServicesToStop");
const tagServices = require("./ecs/tagServices");
const stopServices = require("./ecs/stopServices");
const sleep = require("./utils/sleep");

/**
 * The order we want to stop the ec2: wcf, healthline, app (all asg) -> icm (instance with tag aws:cloudformation:logical-id start with InformixIcm) -> db (instance with tag aws:cloudformation:logical-id start with InformixDB)
 */
function stopAllInstancesAndspinDownSuspenceASGs(
  dryRun,
  currentOperatingTimezone
) {
  console.log(">>>> 1");
  stopAllInstancesAndspinDownSuspenceASG(dryRun, currentOperatingTimezone, [
    "rqp-whics-wcf",
    "rqp-whics-healthline",
    "rqp-whics-app",
  ]).then( (result) => {
    console.log(">>> 2");
    return sleep(6000);
  }).then((result)=> {
    console.log(">>> 3");
    return stopAllInstancesAndspinDownSuspenceASG(dryRun, currentOperatingTimezone, [
      "InformixIcm*",
    ]);
  }).then( (result) => {
    console.log(">>> 4");
    return sleep(6000);
  }).then((result)=> {
    console.log(">>> 5");
    return stopAllInstancesAndspinDownSuspenceASG(dryRun, currentOperatingTimezone, [
      "*",
    ]).then();
  })
  .then((result)=> {
    console.log(">>>> 6 FINAL");
  }).catch(error => {
    console.log(">>> ERROR");
  });

  // sleep(60000).then(
  //   console.log("Wake up and stop icm instances, time:", new Date())
  // ); // We will wait for 4 minutes here

  // console.log("Start, time:", new Date()),
  //   stopAllInstancesAndspinDownSuspenceASG(dryRun, currentOperatingTimezone, [
  //     "InformixIcm*",
  //   ]).then();

  // console.log(
  //   "Sleep for another 60000ms after stopping icm, time:",
  //   new Date()
  // );
  // sleep(60000).then(
  //   console.log("Wake up and stop the rest instances, time:", new Date())
  // ); // We will wait for 4 minutes here

  // console.log("Start, time:", new Date()),
  //   stopAllInstancesAndspinDownSuspenceASG(dryRun, currentOperatingTimezone, [
  //     "*",
  //   ]).then();
}

/**
 *
 * @param {*} dryRun
 * @param {*} currentOperatingTimezone
 * @param {*} application
 * @returns
 */
function stopAllInstancesAndspinDownSuspenceASG(
  dryRun,
  currentOperatingTimezone,
  application
) {
  return new Promise((resolve) => {
    spinDownASGs({ dryRun, currentOperatingTimezone, application });
    suspendASGInstances({ dryRun, currentOperatingTimezone, application });
    stopAllInstances({ dryRun, currentOperatingTimezone, application });
  });
}

/**
 *
 * @param {*} param0
 * @returns
 */
function stopAllInstances({ dryRun, currentOperatingTimezone, application }) {
  return listInstancesToStop(currentOperatingTimezone, application).then(
    (stoppableInstances) => {
      if (dryRun) {
        console.log("Dry run is enabled, will not stop or tag any instances.");
        console.log(
          "Found the following instances that would have been shut down..."
        );
        stoppableInstances.forEach((instance) => {
          console.log(instance);
        });
        return [];
      }

      if (stoppableInstances.length === 0) {
        console.log("No instances found to stop, moving on...");
        return [];
      }

      console.log("Found the following instances to shut down...");
      stoppableInstances.forEach((instance) => {
        console.log(instance);
      });

      return tagInstances(stoppableInstances).then((taggedInstances) => {
        if (taggedInstances.length > 0) {
          console.log("Finished tagging instances. Moving on to stop them.");
          return stopInstances(taggedInstances);
        }

        return [];
      });
    }
  );
}

function spinDownASGs({ dryRun, currentOperatingTimezone, application }) {
  return listASGsToStop(currentOperatingTimezone, application).then(
    (stoppableASGs) => {
      if (dryRun) {
        console.log("Dry run is enabled, will not stop or tag any ASGs.");
        console.log(
          `Found the following ${stoppableASGs.length} auto scaling groups that would have been spun down...`
        );
        stoppableASGs.forEach((asg) => {
          console.log(asg.AutoScalingGroupName);
        });
        return [];
      }

      if (stoppableASGs.length === 0) {
        console.log("No ASGs to spin down, moving on...");
        return [];
      }

      console.log(
        `Found the following ${stoppableASGs.length} auto scaling groups to spin down...`
      );
      stoppableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return tagASGs(stoppableASGs).then((taggedASGs) => {
        if (taggedASGs.length > 0) {
          console.log(
            `Finished tagging ASGs. Moving on to spin down ${taggedASGs.length} of them.`
          );
          return stopASGs(taggedASGs);
        }

        return [];
      });
    }
  );
}

function suspendASGInstances({
  dryRun,
  currentOperatingTimezone,
  application,
}) {
  return listASGsToSuspend(currentOperatingTimezone, application).then(
    (suspendableASG) => {
      if (dryRun) {
        console.log("Dry run is enabled, will not stop or tag any ASGs.");
        console.log(
          `Found the following ${suspendableASG.length} auto scaling groups that would have been suspened and ec2 instances stopped...`
        );
        suspendableASG.forEach((asg) => {
          console.log(asg.AutoScalingGroupName);
          const stoppedInstances = asg.Instances.map((insts) =>
            console.log(insts.InstanceId)
          );
          return Promise.all(stoppedInstances);
        });
        return [];
      }

      if (suspendableASG.length === 0) {
        console.log("No ASGs to suspend, moving on...");
        return [];
      }

      console.log(
        `Found the following ${suspendableASG.length} auto scaling groups to suspend...`
      );
      suspendableASG.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return tagSuspendedASGs(suspendableASG).then((taggedASGs) => {
        if (taggedASGs.length > 0) {
          console.log(
            `Finished tagging ASGs. Moving on to suspend processes for ${taggedASGs.length} ASGs.`
          );
          return suspendASGs(taggedASGs).then(() => {
            suspendableASG.forEach((asg) => {
              console.log(
                "Finished suspending ASGs. Moving on to stopping instances."
              );
              const stoppedInstances = asg.Instances.map((insts) => {
                console.log(`Stopping instance with id: ${insts.InstanceId}`);
                stopInstances([insts.InstanceId]);
              });
              return Promise.all(stoppedInstances);
            });
          });
        }

        return [];
      });
    }
  );
}

function stopAllDBInstances(dryRun) {
  return listDBInstancesToStop()
    .then((arns) => {
      if (dryRun) {
        console.log(
          "Dry run is enabled, will not stop or tag any RDS instances."
        );
        return [];
      }
      return arns;
    })
    .then((arns) => {
      if (arns.length === 0) {
        console.log(
          "There are no RDS instances to stop today. See you the next time."
        );
        return [];
      }
      return stopDBInstances(arns).then((stoppedDBInstanceARNs) => {
        console.log("Finished stopping RDS instances. Moving on to tag them.");
        return tagDBInstances(stoppedDBInstanceARNs);
      });
    })
    .then((arns) => {
      if (arns.length > 0) {
        console.log("Finished tagging RDS instances.");
      }
    });
}

function spinDownServices({ dryRun, currentOperatingTimezone }) {
  return listServicesToStop(currentOperatingTimezone).then(
    (stoppableServices) => {
      if (dryRun) {
        console.log(
          "Dry run is enabled, will not start or untag any services."
        );
        console.log(
          `Found the following ${stoppableServices.length} service[s] that would have been spun down...`
        );
        stoppableServices.forEach((service) => {
          console.log(service.serviceName);
        });
        return [];
      }

      if (stoppableServices.length === 0) {
        console.log("No services to spin down, moving on...");
        return [];
      }

      console.log("Found the following service[s] to spin down...");
      stoppableServices.forEach((service) => {
        console.log(service);
      });

      return tagServices(stoppableServices).then((taggedServices) => {
        if (taggedServices.length > 0) {
          console.log("Finished tagging service[s]. Moving on to stop them.");
          return stopServices(taggedServices);
        }
        return [];
      });
    }
  );
}

module.exports = function stop(options) {
  const { event, callback, dryRun } = options;
  const currentOperatingTimezone = event.currentOperatingTimezone;
  console.log(`Hammertime stop for ${currentOperatingTimezone}`);
  Promise.all([
    stopAllDBInstances(dryRun),
    stopAllInstancesAndspinDownSuspenceASGs({
      dryRun,
      currentOperatingTimezone,
    }),
    spinDownServices({ dryRun, currentOperatingTimezone }),
  ])
    .then(() => {
      if (!dryRun) {
        console.log(
          "All EC2, RDS instances, ASGs, and ECS services stopped successfully. Good night!"
        );
      }
      callback(
        null,
        {
          message: "Stop: Hammertime successfully completed.",
        },
        event
      );
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
};
