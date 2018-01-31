const operatingTimezones = require('./operatingTimezones');
const isEnabled = require('./isEnabled').isEnabled;

const UTC_START_HOUR = 9;
const UTC_STOP_HOUR = 22;

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
    rate: `cron(30 ${offsetUTCHour(UTC_STOP_HOUR, timezone)} * * ? *)`,
    enabled: true, // isEnabled(),
    input: {
      currentOperatingTimezone: timezone,
    },
  }));
  console.log('Stop Crons: ');
  console.log(JSON.stringify(stopCrons));
  return stopCrons; // CRONS for stopping
}

function start() {
  const startCrons = operatingTimezones.map(timezone => ({
    rate: `cron(30 ${offsetUTCHour(UTC_START_HOUR, timezone)} * * ? *)`,
    enabled: true, // isEnabled(),
    input: {
      currentOperatingTimezone: timezone,
    },
  }));
  console.log('Start Crons: ');
  console.log(JSON.stringify(startCrons));
  return startCrons; // CRONS for starting
}

module.exports.stop = stop;
module.exports.start = start;
