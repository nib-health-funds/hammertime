const timezoneString = process.env.HAMMERTIME_OPERATING_TIMEZONES || 'Australia/Sydney';

console.log('Timezones to operate in: ', timezoneString);

const timezones = timezoneString.split(',');

module.exports = timezones;
