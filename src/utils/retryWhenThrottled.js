const promiseRetry = require('promise-retry');

module.exports = function retryWhenThrottled(func) {
  return promiseRetry((retry, number) => func()
    .promise()
    .catch((err) => {
      if (err.code === 'Throttling' || err.code === 'ThrottlingException' || err.code === 'RequestLimitExceeded') {
        console.warn(`Throttled by the AWS API. Backing off... (${number}/10)`);
        retry(err);
      }
      console.warn(`Throttling limit reached. Here is actual error:`);
      throw err;
    }));
};
