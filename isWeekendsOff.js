// eslint-disable-next-line arrow-body-style
module.exports.isEnabled = () => {
  return process.env.WEEKENDS_OFF
    ? process.env.WEEKENDS_OFF === 'true'
    : 'false';
};
