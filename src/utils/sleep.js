module.exports = function sleep(ms) {
  return new Promise((resolve) => {
    console.log('>>>>>>>> BEFORE TIMEOUT');
    setTimeout(() => {
        console.log('<<<<<<< RESOLVE', ms);
        return resolve(ms)
    }, ms);
  });
};
