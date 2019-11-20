const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function suspendableASG(asg) {
  return !hasTag(asg.Tags, "stop:hammertime") && hasTag(asg.Tags, "hammertime:asgsuspend") && canITouchThis(asg.Tags);
}

function listASGsToSuspend(currentOperatingTimezone) {
  return listTargetASGs({ filter: suspendableASG, currentOperatingTimezone });
}

module.exports = listASGsToSuspend;
