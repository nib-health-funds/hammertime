const hasTag = require('./hasTag');
const listTargetASGs = require('./listTargetASGs');
const canITouchThis = require('../tags/getHammerTimeTags');

function startableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg, 'hammertime:canttouchthis')}`);
  return hasTag(asg, 'stop:hammertime') && !canITouchThis(asg.Tags);
}

function listASGsToStart() {
  return listTargetASGs(startableASG);
}

module.exports = listASGsToStart;
