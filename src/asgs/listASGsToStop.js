const hasTag = require("../tags/hasTag.js");
const listTargetASGs = require("./listTargetASGs.js");
const canITouchThis = require("../tags/canITouchThis.js");

function stoppableASG(asg) {
  return !hasTag(asg.Tags, "stop:hammertime") && canITouchThis(asg.Tags);
}

function listASGsToStop(currentOperatingTimezone) {
  return listTargetASGs({ filter: stoppableASG, currentOperatingTimezone });
}

module.exports = listASGsToStop;
