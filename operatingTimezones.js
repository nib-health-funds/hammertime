const timezones = process.env.HAMMERTIME_OPERATING_TIMEZONES || '[10]';

const parsed = JSON.parse(timezones);

module.exports = parsed;