const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function suspendableASG(application) {
  return function suspendableASGFilter(asg) {
    return (
      !hasTag(asg.Tags, "stop:hammertime") &&
      hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application)
    );
  };
}

function listASGsToSuspend(currentOperatingTimezone) {
  return listTargetASGs({ filter: suspendableASG, currentOperatingTimezone });
}

module.exports = listASGsToSuspend;
