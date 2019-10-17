// eslint-disable-next-line arrow-body-style
module.exports.isEnabled = () => {
  return process.env.HAMMERTIME_WEEKENDS_OFF
    ? process.env.HAMMERTIME_WEEKENDS_OFF === 'true'
    : 'true';
};
