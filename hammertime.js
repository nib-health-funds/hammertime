const start = require('./src/start');
const stop = require('./src/stop');

// Try and use env var, otherwise default to false.
const dryRun = process.env.hammerTimeDryRun === 'true' || false;

module.exports = {
  start: (event, context, callback) => start({ event, context, callback, dryRun }),
  stop: (event, context, callback) => stop({ event, context, callback, dryRun }),
};
