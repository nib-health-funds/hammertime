const luxon = require('luxon');
const operatingTimezones = require('./operatingTimezones').timezones();
const isEnabled = require('./isEnabled').isEnabled;

const START_HOUR = parseInt(process.env.HAMMERTIME_START_HOUR || '6', 10);
const STOP_HOUR = parseInt(process.env.HAMMERTIME_STOP_HOUR || '19', 10);

function getCronHour(hour, zone) {
  return luxon.DateTime.fromObject({ hour, zone }).setZone('UTC').hour;
}

function stop() {
  const stopCrons = operatingTimezones.map(timezone => ({
    rate: `cron(0 ${getCronHour(STOP_HOUR, timezone)} * * ? *)`,
    enabled: isEnabled(),
    input: {
      currentOperatingTimezone: timezone,
    },
  }));
  console.log('Stop Crons: ');
  console.log(JSON.stringify(stopCrons));
  return stopCrons.map(schedule => ({ schedule })); // CRONS for stopping
}

function start() {
  const startCrons = operatingTimezones.map(timezone => ({
    rate: `cron(0 ${getCronHour(START_HOUR, timezone)} * * ? *)`,
    enabled: isEnabled(),
    input: {
      currentOperatingTimezone: timezone,
    },
  }));
  console.log('Start Crons: ');
  console.log(JSON.stringify(startCrons));
  return startCrons.map(schedule => ({ schedule })); // CRONS for starting
}

module.exports.stop = stop;
module.exports.start = start;
