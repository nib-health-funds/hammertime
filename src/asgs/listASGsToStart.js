const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

// function startableASG(asg) {
//   return hasTag(asg.Tags, "stop:hammertime") && !hasTag(asg.Tags, "hammertime:asgsuspend") && canITouchThis(asg.Tags);
// }
function startableASG(application) {
  return function startableASGFilter(asg) {
    if (application === 'all') {
      return (
        hasTag(asg.Tags, "stop:hammertime") &&
        !hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags)
      );
    }
    return (
      hasTag(asg.Tags, "stop:hammertime") &&
      !hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application)
    );
  };
}

function listASGsToStart(currentOperatingTimezone, application) {
  return listTargetASGs({ filter: startableASG(application), currentOperatingTimezone });
}

module.exports = listASGsToStart;
