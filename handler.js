'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  stopHammertime.listInstancesToStop()
    .then(stopHammertime.tagStopTime)
    .then(instances => {
      instances.forEach(instance => {
        console.log(`Stopping ${instance}`);
      });
      stopHammertime.stopInstances(instances);
    })
    .then((response) => {
      console.log(response);
      callback(null, { message: 'Doneskies.' }, event);
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
};
