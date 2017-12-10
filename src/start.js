const startASGs = require('./asgs/startASGs');
const listASGsToStart = require('./asgs/listASGsToStart');
const untagASGs = require('./asgs/untagASGs');
const startInstances = require('./instances/startInstances');
const listInstancesToStart = require('./instances/listInstancesToStart');
const untagInstances = require('./instances/untagInstances');

function startAllInstances({dryRun, currentOperatingTimezone}) {
  return listInstancesToStart(currentOperatingTimezone)
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
}

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
}

module.exports = function start(options) {
  const { event, callback, dryRun } = options;
  const currentOperatingTimezone = 10; // Source this from event/context (from CRON event)
  console.log('Break it down!');
  Promise.all([
    startAllInstances({dryRun, currentOperatingTimezone}),
    spinUpASGs(dryRun),
  ]).then(() => {
    if (!dryRun) {
      console.log('All instances and ASGs started successfully. Good morning!');
    }
    callback(null, { message: 'Start: Hammertime successfully completed.' }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
