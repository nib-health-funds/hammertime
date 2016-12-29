'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  stopHammertime.listInstancesToStop()
    .then(stopHammertime.tagStopTime)
    .then(stopHammertime.stopInstances)
    .then(instances => {
      console.log(`Stopped ${instances}`);
      callback(null, { message: 'Doneskies.' }, event);
    })
    .catch(err => {
      console.error(err);
      callback(err);
    });
};
