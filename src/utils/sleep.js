module.exports = function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
        console.log('value of diff--- ', diff);

        return resolve(1);
    }, ms);    
  });
};