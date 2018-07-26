const defaultOperatingTimezone = process.env.HAMMERTIME_DEFAULT_OPERATING_TIMEZONE || 'Australia/Sydney';
const timezoneString = process.env.HAMMERTIME_OPERATING_TIMEZONES || defaultOperatingTimezone;

console.log('Timezones to operate in: ', timezoneString);
const timezones = timezoneString.split(',');

module.exports.defaultOperatingTimezone = () => defaultOperatingTimezone;
module.exports = timezones;
