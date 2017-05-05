const hasTag = require('./hasTag');
const listTargetASGs = require('./listTargetASGs');

function stoppableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg, 'hammertime:canttouchthis')}`);
  return !hasTag(asg, 'stop:hammertime') && !hasTag(asg, 'hammertime:canttouchthis');
}

function listASGsToStop() {
  return listTargetASGs(stoppableASG);
}

module.exports = listASGsToStop;
