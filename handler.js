'use strict';

const stopHammertime = require('./stop-hammertime');
const startHammertime = require('./start-hammertime');

// do we really need this file?
// TODO: refactor how the stop/start methods are structured..

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

module.exports.start = (event, context, callback) => {
  console.log('Break it down!');
  Promise.all([
    stopHammertime.startEC2(),
    //stopHammertime.startASG(),
  ]).then(responses => {
    console.log(responses);
    callback(null, { message: 'Doneskies.' }, event);
  }).catch(err => {
    console.error(err);
    callback(err);
  });
};
