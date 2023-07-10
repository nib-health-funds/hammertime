const hasTag = require("../tags/hasTag");
const hasTagValue = require("../tags/hasTagValue");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");

function suspendableASG(application) {
  return function suspendableASGFilter(asg) {
    if (application === 'all') {
      return (
        !hasTag(asg.Tags, "stop:hammertime") &&
        hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags) &&
        hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])        
      );  
    }
    return (
      !hasTag(asg.Tags, "stop:hammertime") &&
      hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application) &&
      hasTagValue(asg.Tags, "Slice", ['w-2-c-546'])      
    );
  };
}

function listASGsToSuspend(currentOperatingTimezone, application) {
  return listTargetASGs({ filter: suspendableASG(application), currentOperatingTimezone });
}

module.exports = listASGsToSuspend;
