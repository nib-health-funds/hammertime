const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function startableASG(asg) {
  return hasTag(asg.Tags, "stop:hammertime") && canITouchThis(asg.Tags);
}

function listASGsToStart(currentOperatingTimezone) {
  return listTargetASGs({ filter: startableASG, currentOperatingTimezone });
}

module.exports = listASGsToStart;
