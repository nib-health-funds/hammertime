const stopASGs = require('./asgs/stopASGs');
const listASGsToStop = require('./asgs/listASGsToStop');
const tagASGs = require('./asgs/tagASGs');
const listInstancesToStop = require('./instances/listInstancesToStop');
const tagInstances = require('./instances/tagInstances');
const stopInstances = require('./instances/stopInstances');

function spinDownASGs() {
  return listASGsToStop()
    .then((stoppableASGs) => {
      console.log(`Found the following ${stoppableASGs.length} instances to spin down...`);
      if (stoppableASGs.length === 0) {
        console.log('None! Moving on.');
        return 'No ASGs to spin down';
      }

      stoppableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });
      return tagASGs(stoppableASGs);
    })
    .then((taggedASGs) => {
      console.log(`Finished tagging ASGs. Moving on to spin down ${taggedASGs.length} of them.`);
      return stopASGs(taggedASGs);
    });
}

function stopAllInstances() {
  return listInstancesToStop()
    .then((stoppableInstances) => {
      console.log('Found the following instances to shut down...');
      if (stoppableInstances.length === 0) {
        console.log('None! Moving on.');
        return [];
      }

      stoppableInstances.forEach((instance) => {
        console.log(instance);
      });
      return tagInstances(stoppableInstances);
    })
    .then((taggedInstances) => {
      console.log(`Finished tagging instances. Moving on to stop ${taggedInstances.length} of them.`);
      return stopInstances(taggedInstances);
    });
}

module.exports = function stop(event, context, callback) {
  console.log('Stop. Hammertime!');
  Promise.all([
    stopAllInstances(),
    spinDownASGs(),
  ]).then(() => {
    console.log('All instances and ASGs stopped successfully. Good night!');
    callback(null, { message: 'Stop: Hammertime successfully completed.' }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
