const operatingTimezone = require('../tags/operatingTimezone');

function isInOperatingTimezone(currentOperatingTimezone) {
  return (tags) => {
    const resourceOperatingTimezone = operatingTimezone(tags);
    console.log('Resource operating timezone', resourceOperatingTimezone);
    console.log('Current operating timezone', currentOperatingTimezone);
    return resourceOperatingTimezone === currentOperatingTimezone;
  };
}

module.exports = isInOperatingTimezone;
