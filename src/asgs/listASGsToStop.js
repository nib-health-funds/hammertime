const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function stoppableASG(asg) {
  console.log('Stoppable ASG: ', !hasTag(asg.Tags, "stop:hammertime") && canITouchThis(asg.Tags));
  return !hasTag(asg.Tags, "stop:hammertime") && canITouchThis(asg.Tags);
}

function listASGsToStop(currentOperatingTimezone) {
  return listTargetASGs({ filter: stoppableASG, currentOperatingTimezone });
}

module.exports = listASGsToStop;
