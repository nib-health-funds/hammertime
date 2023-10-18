const start = require('./start');
const stop = require('./stop');

// Try and use env var, otherwise default to false.
const dryRun = process.env.hammerTimeDryRun === 'true' || false;

module.exports = {
  start: (event, context, callback) => start({ event, context, callback, dryRun }),
  stop: (event, context, callback) => stop({ event, context, callback, dryRun }),
};
