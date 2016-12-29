'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  listInstancesToStop()
    .then(tagStopTime)
    // .then(stopInstances)
    .then((response) => {
      console.log(response);
      callback(null, { message: 'Doneskies.' }, event);
    })
    .catch(error => {
      console.error(error);
      callback(error);
    });
};
