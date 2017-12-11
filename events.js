const operatingTimezones = require('./operatingTimezones');
const isEnabled = require('./isEnabled').isEnabled;

function offsetUTCHour(utcHour, utcTimezoneOffset) {
  const convertedHour = utcHour + utcTimezoneOffset;

  if (convertedHour > 23) {
    return convertedHour - 23; // wrapped to next day
  }

  if (convertedHour < 0) {
    return convertedHour + 23; // wrapped to previous day
  }

  return convertedHour;
}

function stop() {
  const stopCrons = operatingTimezones.map(timezone => ({
    rate: `cron(30 ${offsetUTCHour(22, timezone)} * * ? *)`,
    enabled: isEnabled(),
  }));
  return {
    schedule: stopCrons, // CRONS for stopping
  };
}

function start() {
  const startCrons = operatingTimezones.map(timezone => ({
    rate: `cron(30 ${offsetUTCHour(9, timezone)} * * ? *)`,
    enabled: isEnabled(),
  }));
  return {
    schedule: startCrons, // CRONS for starting
  };
}

module.exports.stop = stop;
module.exports.start = start;
