'use strict';

const instances = require('./src/instances')
const asgs      = require('./src/asgs')

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  Promise.all([
    stopInstances(),
    stopASGs(),
  ]).then(responses => {
    console.log('All instances and ASGs stopped successfully. Good night!');
    callback(null, { message: 'Stop: Hammertime successfully completed.' }, event);
  }).catch(err => {
    console.error(err);
    callback(err);
  });
};

module.exports.start = (event, context, callback) => {
  console.log('Break it down!');
  Promise.all([
    startInstances(),
    startASGs(),
  ]).then(responses => {
    console.log('All instances and ASGs started successfully. Good morning!');
    callback(null, { message: 'Start: Hammertime successfully completed.' }, event);
  }).catch(err => {
    console.error(err);
    callback(err);
  });
};

function stopInstances() {
  return new Promise((resolve, reject) => {
    instances.listInstancesToStop()
      .then(stoppableInstances => {
        console.log("Found the following instances to shut down...");
        if (stoppableInstances.length === 0) {
          console.log("None! Moving on.");
          resolve("No instances to shut down");
        }

        stoppableInstances.forEach(instance => {
          console.log(instance);
        });
        return instances.tagInstances(stoppableInstances);
      })
      .then(taggedInstances => {
        console.log("Finished tagging instances. Moving on to stop them.");
        return instances.stopInstances(taggedInstances);
      })
      .then(resolve)
      .catch(reject);
  });
}

function startInstances() {
  return new Promise((resolve, reject) => {
    instances.listInstancesToStart()
      .then(startableInstances => {
        console.log(`Found the following ${startableInstances.length} instances to start up...`);
        if (startableInstances.length === 0) {
          console.log("None! Moving on.");
          resolve("No instances to turn on");
        }

        startableInstances.forEach(instance => {
          console.log(instance);
        });
        return instances.startInstances(startableInstances);
      })
      .then(startedInstances => {
        console.log("Finished starting instances. Moving on to untag them.");
        return instances.untagInstances(startedInstances);
      })
      .then(resolve)
      .catch(reject);
  });
}

function stopASGs() {
  return new Promise((resolve, reject) => {
    asgs.listASGsToStop()
      .then(stoppableASGs => {
        console.log(`Found the following ${stoppableASGs.length} instances to spin down...`);
        if (stoppableASGs.length === 0) {
          console.log("None! Moving on.");
          resolve("No ASGs to spin down");
        }

        stoppableASGs.forEach(asg => {
          console.log(asg.AutoScalingGroupName);
        });
        return asgs.tagASGs(stoppableASGs);
      })
      .then(taggedASGs => {
        console.log(`Finished tagging ASGs. Moving on to spin down ${taggedASGs.length} of them.`);
        return asgs.stopASGs(taggedASGs);
      })
      .then(resolve)
      .catch(reject);
  });
}

function startASGs() {
  return new Promise((resolve, reject) => {
    asgs.listASGsToStart()
      .then(startableASGs => {
        console.log(`Found the following ${startableASGs.length} instances to start up...`);
        if (startableASGs.length === 0) {
          console.log("None! Moving on.");
          resolve("No ASGs to spin up");
        }

        startableASGs.forEach(asg => {
          console.log(asg.AutoScalingGroupName);
        });
        return asgs.startASGs(startableASGs);
      })
      .then(startedASGs => {
        console.log(`Finished spinning up ASGs. Moving on to untag ${startedASGs.length} of them.`);
        return asgs.untagASGs(startedASGs);
      })
      .then(resolve)
      .catch(reject);
  });
}
