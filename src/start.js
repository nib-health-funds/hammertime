const instances = require('./instances');
const startASGs = require('./asgs/startASGs');
const listASGsToStart = require('./asgs/listASGsToStart');
const untagASGs = require('./asgs/untagASGs');

function startInstances() {
  return instances.listInstancesToStart()
    .then((startableInstances) => {
      console.log(`Found the following ${startableInstances.length} instances to start up...`);
      if (startableInstances.length === 0) {
        console.log('None! Moving on.');
        return 'No instances to turn on';
      }

      startableInstances.forEach((instance) => {
        console.log(instance);
      });
      return instances.startInstances(startableInstances);
    })
    .then((startedInstances) => {
      console.log('Finished starting instances. Moving on to untag them.');
      return instances.untagInstances(startedInstances);
    });
}

function spinUpASGs() {
  return listASGsToStart()
    .then((startableASGs) => {
      console.log(`Found the following ${startableASGs.length} instances to start up...`);
      if (startableASGs.length === 0) {
        console.log('None! Moving on.');
        return 'No ASGs to spin up';
      }

      startableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });
      return startASGs(startableASGs);
    })
    .then((startedASGs) => {
      console.log(`Finished spinning up ASGs. Moving on to untag ${startedASGs.length} of them.`);
      return untagASGs(startedASGs);
    });
}

module.exports = function start(event, context, callback) {
  console.log('Break it down!');
  Promise.all([
    startInstances(),
    spinUpASGs(),
  ]).then(() => {
    console.log('All instances and ASGs started successfully. Good morning!');
    callback(null, { message: 'Start: Hammertime successfully completed.' }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};