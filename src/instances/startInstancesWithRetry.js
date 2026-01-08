const startInstances = require("./startInstances");
const sleep = require("../utils/sleep");

/**
 * Retry logic for starting instances with exponential backoff
 * @param {*} startableInstances - List of instances to start
 * @param {number} attempt - Current attempt number (default: 1)
 * @param {number} maxAttempts - Maximum number of retry attempts (default: 10)
 * @returns {Promise} - Promise that resolves with started instance IDs
 */
function startInstancesWithRetry(startableInstances, attempt = 1, maxAttempts = 10) {
  const retryInterval = 60000; // 1 minute

  console.log(`Attempt ${attempt}/${maxAttempts} to start instances`);

  return startInstances(startableInstances)
    .then((startedInstanceIds) => {
      console.log(`Successfully started instances on attempt ${attempt}`);
      return startedInstanceIds;
    })
    .catch((error) => {
      console.log(`Error starting instances on attempt ${attempt}:`, error);

      if (attempt >= maxAttempts) {
        console.log(`Max retry attempts (${maxAttempts}) reached. Failing.`);
        throw error;
      }

      console.log(`Retrying in 1 minute... (attempt ${attempt + 1}/${maxAttempts})`);
      return sleep(retryInterval).then(() => {
        return startInstancesWithRetry(startableInstances, attempt + 1, maxAttempts);
      });
    });
}

module.exports = startInstancesWithRetry;
