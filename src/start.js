const startASGs = require('./asgs/startASGs');
const listASGsToStart = require('./asgs/listASGsToStart');
const untagASGs = require('./asgs/untagASGs');
const startInstances = require('./instances/startInstances');
const listInstancesToStart = require('./instances/listInstancesToStart');
const untagInstances = require('./instances/untagInstances');
const listDBInstancesToStart = require('./rds/listDBInstancesToStart');
const startDBInstances = require('./rds/startDBInstances');
const untagDBInstances = require('./rds/untagDBInstances')

function startAllInstances(dryRun) {
  return listInstancesToStart()
    .then((startableInstances) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any instances.');
        return [];
      }

      if (startableInstances.length === 0) {
        console.log('No instances found to start, moving on...');
        return [];
      }

      console.log(`Found the following ${startableInstances.length} instances to start up...`);
      startableInstances.forEach((instance) => {
        console.log(instance);
      });

      return startInstances(startableInstances).then((startedInstanceIds) => {
        console.log('Finished starting instances. Moving on to untag them.');
        return untagInstances(startedInstanceIds);
      });
    });
};

function spinUpASGs(dryRun) {
  return listASGsToStart()
    .then((startableASGs) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any ASGs.');
        return [];
      }

      if (startableASGs.length === 0) {
        console.log('No ASGs found to spin up, moving on...');
        return [];
      }

      console.log(`Found the following ${startableASGs.length} instances to start up...`);
      // Log startableASGs for easy debugging
      startableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return startASGs(startableASGs).then((startedASGs) => {
        console.log(`Finished spinning up ASGs. Moving on to untag ${startedASGs.length} of them.`);
        return untagASGs(startedASGs);
      });
    });
};

function startAllDBInstances(dryRun) {
  return listDBInstancesToStart()
    .then((arns) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any RDS instances.');
        return [];
      } else {
        return arns;
      };
    })
    .then((arns) => {
      if (arns.length == 0) {
        console.log('There are no RDS instances to start today. See you the next time.')
        return [];
      } else {
        return startDBInstances(arns)
          .then((arns) => {
            console.log('Finished starting RDS instances. Moving on to untag them.');
            return untagDBInstances(arns);
          });
      }
    })
    .then((arns) => {
      if (arns.length > 0) {
        console.log('Finished tagging RDS instances.')
      }
    });
};

module.exports = function start(options) {
  const {
    event,
    callback,
    dryRun
  } = options;
  console.log('Break it down!');
  Promise.all([
    startAllDBInstances(dryRun),
    startAllInstances(dryRun),
    spinUpASGs(dryRun),
  ]).then(() => {
    if (!dryRun) {
      console.log('All EC2, RDS instances and ASGs started successfully. Good morning!');
    }
    callback(null, {
      message: 'Start: Hammertime successfully completed.'
    }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
