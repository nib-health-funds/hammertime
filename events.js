const operatingTimezones = require('./operatingTimezones');
const isEnabled = require('./isEnabled').isEnabled;

function stop() {
    const stopCrons = operatingTimezones.map(timezone => {
        return {
            rate: 'cron(30 9 * * ? *)',
            enabled: isEnabled()
        }
    });
    
    return {
        schedule: stopCrons // CRONS for stopping
    };
}

function start() {
    const startCrons = operatingTimezones.map(timezone => {
        return {
            rate: 'cron(30 19 * * ? *)',
            enabled: isEnabled()
        }
    });
    return {
        schedule: startCrons // CRONS for starting
    };
}

module.exports.stop = stop;
module.exports.start = start;