// eslint-disable-next-line arrow-body-style
module.exports.isEnabled = () => {
  return process.env.HAMMERTIME_ENABLED
    ? process.env.HAMMERTIME_ENABLED === 'true'
    : 'true';
};
