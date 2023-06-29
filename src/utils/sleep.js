module.exports = function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
        console.log('setTimeout--- ');

        return resolve(1);
    }, ms);    
  });
};