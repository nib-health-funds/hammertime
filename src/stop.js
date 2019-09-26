const stopASGs = require('./asgs/stopASGs');
const listASGsToStop = require('./asgs/listASGsToStop');
const tagASGs = require('./asgs/tagASGs');
const suspendASGs = require('./asgs/suspendASGs');
const listASGsToSuspend = require('./asgs/listASGsToSuspend');
const tagSuspendedASGs = require('./asgs/tagSuspendedASGs');
const listInstancesToStop = require('./instances/listInstancesToStop');
const tagInstances = require('./instances/tagInstances');
const stopInstances = require('./instances/stopInstances');
const listDBInstancesToStop = require('./rds/listDBInstancesToStop');
const stopDBInstances = require('./rds/stopDBInstances');
const tagDBInstances = require('./rds/tagDBInstances');


function stopAllInstances({ dryRun, currentOperatingTimezone }) {
  return listInstancesToStop(currentOperatingTimezone)
    .then((stoppableInstances) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not stop or tag any instances.');
        console.log('Found the following instances that would have been shut down...');
        stoppableInstances.forEach((instance) => {
          console.log(instance);
        });
        return [];
      }

      if (stoppableInstances.length === 0) {
        console.log('No instances found to stop, moving on...');
        return [];
      }

      console.log('Found the following instances to shut down...');
      stoppableInstances.forEach((instance) => {
        console.log(instance);
      });

      return tagInstances(stoppableInstances).then((taggedInstances) => {
        if (taggedInstances.length > 0) {
          console.log('Finished tagging instances. Moving on to stop them.');
          return stopInstances(taggedInstances);
        }

        return [];
      });
    });
}

function spinDownASGs({ dryRun, currentOperatingTimezone }) {
  return listASGsToStop(currentOperatingTimezone)
    .then((stoppableASGs) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not stop or tag any ASGs.');
        console.log(`Found the following ${stoppableASGs.length} auto scaling groups that would have been spun down...`);
        stoppableASGs.forEach((asg) => {
          console.log(asg.AutoScalingGroupName);
        });
        return [];
      }

      if (stoppableASGs.length === 0) {
        console.log('No ASGs to spin down, moving on...');
        return [];
      }

      console.log(`Found the following ${stoppableASGs.length} auto scaling groups to spin down...`);
      stoppableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return tagASGs(stoppableASGs).then((taggedASGs) => {
        if (taggedASGs.length > 0) {
          console.log(`Finished tagging ASGs. Moving on to spin down ${taggedASGs.length} of them.`);
          return stopASGs(taggedASGs);
        }

        return [];
      });
    });
}

function suspendASGInstances({ dryRun, currentOperatingTimezone }) {
  return listASGsToSuspend(currentOperatingTimezone)
    .then((suspendableASG) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not stop or tag any ASGs.');
        console.log(`Found the following ${suspendableASG.length} auto scaling groups that would have been suspened and ec2 instances stopped...`);
        suspendableASG.forEach((asg) => {
          console.log(asg.AutoScalingGroupName);
        });
        return [];
      }

      if (suspendableASG.length === 0) {
        console.log('No ASGs to suspend, moving on...');
        return [];
      }

      console.log(`Found the following ${suspendableASG.length} auto scaling groups to suspend...`);
      suspendableASG.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return tagSuspendedASGs(suspendableASG).then((taggedASGs) => {
        if (taggedASGs.length > 0) {
          console.log(`Finished tagging ASGs. Moving on to suspending processes for ${taggedASGs.length} ASGs.`);
          return suspendASGs(taggedASGs)
          .then(() => {
            suspendableASG.forEach((instance) => {
              console.log(instance);
            });
          });
        }

        return [];
      });
    });
}

function stopAllDBInstances(dryRun) {
  return listDBInstancesToStop()
    .then((arns) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not stop or tag any RDS instances.');
        return [];
      }
      return arns;
    })
    .then((arns) => {
      if (arns.length === 0) {
        console.log('There are no RDS instances to stop today. See you the next time.');
        return [];
      }
      return stopDBInstances(arns)
        .then((stoppedDBInstanceARNs) => {
          console.log('Finished stopping RDS instances. Moving on to tag them.');
          return tagDBInstances(stoppedDBInstanceARNs);
        });
    })
    .then((arns) => {
      if (arns.length > 0) {
        console.log('Finished tagging RDS instances.');
      }
    });
}

module.exports = function stop(options) {
  const { event, callback, dryRun } = options;
  const currentOperatingTimezone = event.currentOperatingTimezone;
  console.log(`Hammertime stop for ${currentOperatingTimezone}`);
  Promise.all([
    stopAllDBInstances(dryRun),
    stopAllInstances({ dryRun, currentOperatingTimezone }),
    spinDownASGs({ dryRun, currentOperatingTimezone }),
    suspendASGInstances({ dryRun, currentOperatingTimezone }),
  ]).then(() => {
    if (!dryRun) {
      console.log('All EC2, RDS instances and ASGs stopped successfully. Good night!');
    }
    callback(null, {
      message: 'Stop: Hammertime successfully completed.',
    }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
