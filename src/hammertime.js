const start = require('./start');
const stop = require('./stop');

// Try and use env var, otherwise default to false.
// TODO: set dryRun = true for testing
// const dryRun = process.env.hammerTimeDryRun === 'true' || false;
const dryRun = true;

module.exports = {
  start: (event, context, callback) => start({ event, context, callback, dryRun }),
  // stop: (event, context, callback) => stop({ event, context, callback, dryRun }),
  //TODO: set dryrun = false for testing
  stop: (event, context, callback) => stop({ event, context, callback, dryRun:false }),
};
