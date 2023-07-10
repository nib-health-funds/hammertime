const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");
const hasTagValue = require("../tags/hasTagValue");

function startableASG(application) {
  return function startableASGFilter(asg) {
    if (application === 'all') {
      return (
        hasTag(asg.Tags, "stop:hammertime") &&
        !hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags) &&
        hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])
      );
    }
    return (
      hasTag(asg.Tags, "stop:hammertime") &&
      !hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application) &&
      hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])
    );
  };
}

function listASGsToStart(currentOperatingTimezone, application) {
  return listTargetASGs({ filter: startableASG(application), currentOperatingTimezone });
}

module.exports = listASGsToStart;
