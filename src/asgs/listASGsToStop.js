const hasTag = require('../tags/hasTag');
const listTargetASGs = require('./listTargetASGs');
const canITouchThis = require('../tags/canITouchThis');
const operatingTimezone = require('../tags/operatingTimezone');

function stoppableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg.Tags, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg.Tags, 'hammertime:canttouchthis')}, operating timezone is ${operatingTimezone(asg.Tags)}`);
  return !hasTag(asg.Tags, 'stop:hammertime') && canITouchThis(asg.Tags);
}

function listASGsToStop(currentOperatingTimezone) {
  return listTargetASGs({ filter: stoppableASG, currentOperatingTimezone });
}

module.exports = listASGsToStop;
