const hasTag = require("../tags/hasTag.js");
const listTargetASGs = require("./listTargetASGs.js");
const canITouchThis = require("../tags/canITouchThis.js");

function startableASG(asg) {
  return hasTag(asg.Tags, "stop:hammertime") && canITouchThis(asg.Tags);
}

function listASGsToStart(currentOperatingTimezone) {
  return listTargetASGs({ filter: startableASG, currentOperatingTimezone });
}

module.exports = listASGsToStart;
