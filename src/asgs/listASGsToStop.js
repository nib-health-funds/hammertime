const hasTag = require('../tags/hasTag');
const listTargetASGs = require('./listTargetASGs');
const canITouchThis = require('../tags/canITouchThis');

function stoppableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg.Tags, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg.Tags, 'hammertime:canttouchthis')}`);
  return !hasTag(asg.Tags, 'stop:hammertime') && canITouchThis(asg.Tags);
}

function listASGsToStop() {
  return listTargetASGs(stoppableASG);
}

module.exports = listASGsToStop;
