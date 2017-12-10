const operatingTimezone = require('../tags/operatingTimezone');

function isInOperatingTimezone(currentOperatingTimezone) {
    return function(tags) {
        const resourceOperatingTimezone = operatingTimezone(tags);
        return resourceOperatingTimezone === currentOperatingTimezone;
    }
}

module.exports = isInOperatingTimezone;