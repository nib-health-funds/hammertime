const hasTag = require('../tags/hasTag');
const listTargetASGs = require('./listTargetASGs');
const canITouchThis = require('../tags/canITouchThis');

function startableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg.Tags, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg.Tags, 'hammertime:canttouchthis')}`);
  return hasTag(asg.Tags, 'stop:hammertime') && canITouchThis(asg.Tags);
}

function listASGsToStart(currentOperatingTimezone) {
  return listTargetASGs({filter: startableASG, currentOperatingTimezone});
}

module.exports = listASGsToStart;
