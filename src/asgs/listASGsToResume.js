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
      );
    }
    return (
      hasTag(asg.Tags, "stop:hammertime") &&
      hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application)
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
