// eslint-disable-next-line arrow-body-style
module.exports.turnOffWeekends = () => {
  return process.env.HAMMERTIME_TURN_OFF_WEEKENDS
    ? process.env.HAMMERTIME_TURN_OFF_WEEKENDS === 'true'
    : 'false';
};
