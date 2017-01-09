'use strict';

const instances = require('./src/instances')
const asgs      = require('./src/asgs')

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  Promise.all([
    stopInstances(),
    stopASGs(),
  ]).then(responses => {
    responses.forEach(res => console.log(res));
    callback(null, { message: 'All instances and ASGs stopped successfully. Good night!' }, event);
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
    responses.forEach(res => console.log(res));
    callback(null, { message: 'All instances and ASGs started successfully. Good morning!' }, event);
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
	startableInstances.forEach(instance => {
          console.log(instance);
	});
        return instances.tagInstances;
      })
      .then(taggedInstances => {
        console.log("Finished tagging instances. Moving on to stop them.");
        console.log("Not stopping them for now!")
        //return instances.stopInstances;
        return taggedInstances;
      })
      .then(resolve)
      .catch(reject);
  });
}

function startInstances() {
  return new Promise((resolve, reject) => {
    instances.listInstancesToStart()
      .then(startableInstances => {
        console.log("Found the following instances to start up...");
	startableInstances.forEach(instance => {
          console.log(instance);
	});
        return instances.startInstances;
      })
      .then(startedInstances => {
        console.log("Finished starting instances. Moving on to untag them.");
        return instances.untagInstances;
      })
      .then(resolve)
      .catch(reject);
  });
}

function stopASGs() {
  return new Promise((resolve, reject) => {
    asgs.listASGsToStop()
      .then(stoppableASGs => {
        console.log("Found the following ASGs to spin down...");
        stoppableASGs.forEach(asg => {
	  console.log(asg.AutoScalingGroupName);
	});
        return asgs.tagASGs;
      })
      .then(taggedASGs => {
        console.log("Finished tagging ASGs. Moving on to spin them down.");
        console.log("Not spinning them down for now!")
        //return asgs.stopASGs;
        return taggedASGs;
      })
      .then(resolve)
      .catch(reject);
  });
}

function startASGs() {
  return new Promise((resolve, reject) => {
    asgs.listASGsToStart()
      .then(startableASGs => {
        console.log("Found the following ASGs to spin up...");
        startableASGs.forEach(asg => {
	  console.log(asg.AutoScalingGroupName);
	});
        return asgs.spinUpASGs;
      })
      .then(startedASGs => {
        console.log("Finished spinning up ASGs. Moving on to untag them.");
        return asgs.untagASGs;
      })
      .then(resolve)
      .catch(reject);
  });
}
