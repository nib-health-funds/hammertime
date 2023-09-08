const promiseRetry = require('promise-retry');

module.exports = function retryWhenThrottled(func) {
  return promiseRetry((retry, number) => Promise.resolve(func())
    .catch((err) => {
      console.log('This is the output error', err.ErrorType)
      if (err.ErrorType === 'Throttling' || err.ErrorType === 'ThrottlingException') {
        console.warn(`Throttled by the AWS API. Backing off... (${number}/10)`);
        retry(err);
      }
      throw err;
    }));
};
