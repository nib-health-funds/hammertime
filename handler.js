'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

module.exports.stop = (event, context, callback) => {
  console.log('Stop. Hammertime!');
  Promise.all([
    stopHammertime.stopEC2(),
    stopHammertime.stopASG(),
  ]).then(responses => {
    console.log(responses);
    callback(null, { message: 'Doneskies.' }, event);
  }).catch(err => {
    console.error(err);
    callback(err);
  });
};
