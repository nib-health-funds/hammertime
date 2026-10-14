const start = require('./start');
const stop = require('./stop');

// Try and use env var, otherwise default to false.
const dryRun = process.env.hammerTimeDryRun === 'true' || false;

// Node.js 24 Lambda runtime removed support for callback-style handlers, so adapt
// the existing callback-based start/stop functions to a Promise-based handler.
function toHandler(fn) {
  return (event, context) => new Promise((resolve, reject) => {
    fn({
      event,
      context,
      callback: (err, result) => (err ? reject(err) : resolve(result)),
      dryRun,
    });
  });
}

module.exports = {
  start: toHandler(start),
  stop: toHandler(stop),
};
