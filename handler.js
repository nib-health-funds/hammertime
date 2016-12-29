'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  return new Promise((resolve, reject) => {
    listInstancesToStop()
      .then(tagInstances)
      .then(stopInstances)
      .then(resolve)
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
};
