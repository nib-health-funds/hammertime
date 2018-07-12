const stopASGs = require('./asgs/stopASGs');
const listASGsToStop = require('./asgs/listASGsToStop');
const tagASGs = require('./asgs/tagASGs');
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

function spinDownASGs(dryRun) {
  return listASGsToStop()
    .then((stoppableASGs) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not stop or tag any ASGs.');
        return [];
      }

      if (stoppableASGs.length === 0) {
        console.log('No ASGs to spin down, moving on...');
        return [];
      }

      console.log(`Found the following ${stoppableASGs.length} instances to spin down...`);
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
        console.log('There are no RDS instances to stop today. See you the next time.')
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
        console.log('Finished tagging RDS instances.')
      }
    });
}

module.exports = function stop(options) {
  const { event, callback, dryRun } = options;
  const currentOperatingTimezone = event.currentOperatingTimezone;
  console.log('Stop. Hammertime!');
  Promise.all([
    stopAllDBInstances(dryRun),
    stopAllInstances({ dryRun, currentOperatingTimezone }),
    spinDownASGs(dryRun),
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
