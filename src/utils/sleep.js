module.exports = function sleep(ms) {
  return new Promise((resolve) => {
    console.log('>>>>>>>> BEFORE TIMEOUT');
    setTimeout(() => {
        console.log('<<<<<<< SLEEP', ms);
        return resolve(ms)
    }, ms);
  });
};
