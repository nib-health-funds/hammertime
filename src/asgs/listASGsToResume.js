const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");
const hasTagValue = require("../tags/hasTagValue");

function resumeableASG(application) {
  return function suspendableASGFilter(asg) {
    if (application === "all") {
      return (
        hasTag(asg.Tags, "stop:hammertime") &&
        hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags)
        // (hasTagValue(asg.Tags, "Slice", ['w-2-c-680']) || hasTagValue(asg.Tags, "branch", ['W2C-680']))
      );
    }
    return (
      hasTag(asg.Tags, "stop:hammertime") &&
      hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application)
      // (hasTagValue(asg.Tags, "Slice", ['w-2-c-680']) || hasTagValue(asg.Tags, "branch", ['W2C-680']))
    );
  };
}

function listASGsToResume(currentOperatingTimezone, application) {
  return listTargetASGs({
    filter: resumeableASG(application),
    currentOperatingTimezone,
  });
}

module.exports = listASGsToResume;
