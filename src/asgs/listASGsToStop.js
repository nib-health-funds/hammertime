const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");
const hasTagValue = require("../tags/hasTagValue");

function stoppableASG(application) {
  return function stoppableASGFilter(asg) {
    if (application === 'all') {
      return (
        !hasTag(asg.Tags, "stop:hammertime") &&
        !hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags) &&
        hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])        
      );
    }
    return (
      !hasTag(asg.Tags, "stop:hammertime") &&
      !hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application) &&
      hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])      
    );
  };
}

function listASGsToStop(currentOperatingTimezone, application) {
  return listTargetASGs({ filter: stoppableASG(application), currentOperatingTimezone });
}

module.exports = listASGsToStop;