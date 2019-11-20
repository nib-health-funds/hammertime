const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function resumeableASG(asg) {
  return hasTag(asg.Tags, "stop:hammertime") && hasTag(asg.Tags, "hammertime:asgsuspend") && canITouchThis(asg.Tags);
}

function listASGsToResume(currentOperatingTimezone) {
  return listTargetASGs({ filter: resumeableASG, currentOperatingTimezone });
}

module.exports = listASGsToResume;
