const start = require('./start');
const stop = require('./stop');

const dryRun = process.env.hammerTimeDryRun === 'true' || false;

module.exports = {
  start: (event, context, callback) => start({ event, context, callback, dryRun }),
  // stop: (event, context, callback) => stop({ event, context, callback, dryRun }),
  //TODO: set dryrun = false for testing
  stop: (event, context, callback) => stop({ event, context, callback, dryRun }),
};
