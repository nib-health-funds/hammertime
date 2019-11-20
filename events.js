const luxon = require('luxon');
const operatingTimezones = require('./operatingTimezones').timezones();
const isEnabled = require('./isEnabled').isEnabled;
const isWeekendsOff = require('./isWeekendsOff').isEnabled;

const START_HOUR = parseInt(process.env.HAMMERTIME_START_HOUR || '6', 10);
const STOP_HOUR = parseInt(process.env.HAMMERTIME_STOP_HOUR || '19', 10);

function getCronDayHour(day, hour, zone) {
  return {
    day: luxon.DateTime.fromObject({ weekday: day, hour: hour, zone: zone }).setZone('UTC').weekdayShort,
    hour: luxon.DateTime.fromObject({ weekday: day, hour: hour, zone: zone }).setZone('UTC').hour
  }
}

function getCron(hour, timezone) {
  start = getCronDayHour('1', hour, timezone);
  end = getCronDayHour('5', hour, timezone);
  cronHour = start.hour
  return (isWeekendsOff ? `cron(0 ${cronHour} ? * ${start.day}-${end.day} *)` : `cron(0 ${cronHour} * * ? *)`);
}

function stop() {
  const stopCrons = operatingTimezones.map(timezone => ({
    rate: getCron(STOP_HOUR, timezone),
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
    rate: getCron(START_HOUR, timezone),
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
