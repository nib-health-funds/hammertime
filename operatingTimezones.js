const timezones = process.env.HAMMERTIME_OPERATING_TIMEZONES || '[\'Australia/Sydney\']';

console.log('Timezones to operate in: ', timezones);

const parsed = JSON.parse(timezones);

module.exports = parsed;
