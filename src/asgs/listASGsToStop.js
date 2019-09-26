const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function stoppableASG(asg) {
  return !hasTag(asg.Tags, "stop:hammertime") && !hasTag(asg.Tags, "hammertime:asgsuspend") && canITouchThis(asg.Tags);
}

function listASGsToStop(currentOperatingTimezone) {
  return listTargetASGs({ filter: stoppableASG, currentOperatingTimezone });
}

module.exports = listASGsToStop;
