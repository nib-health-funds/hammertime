const operatingTimezone = require('../tags/operatingTimezone.js');

function isInOperatingTimezone(currentOperatingTimezone) {
  return (tags) => {
    const resourceOperatingTimezone = operatingTimezone(tags);
    return resourceOperatingTimezone === currentOperatingTimezone;
  };
}

module.exports = isInOperatingTimezone;
