const stopASGs = require('./asgs/stopASGs');
const listASGsToStop = require('./asgs/listASGsToStop');
const tagASGs = require('./asgs/tagASGs');
const listInstancesToStop = require('./instances/listInstancesToStop');
const tagInstances = require('./instances/tagInstances');
const stopInstances = require('./instances/stopInstances');

function stopAllInstances(dryRun) {
  return listInstancesToStop()
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

module.exports = function stop(options) {
  const { event, callback, dryRun } = options;
  console.log('Stop. Hammertime!');
  Promise.all([
    stopAllInstances(dryRun),
    spinDownASGs(dryRun),
  ]).then(() => {
    if (!dryRun) {
      console.log('All instances and ASGs stopped successfully. Good night!');
    }
    callback(null, { message: 'Stop: Hammertime successfully completed.' }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
