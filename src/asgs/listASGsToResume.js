const hasTag = require("../tags/hasTag");
const listTargetASGs = require("./listTargetASGs");
const canITouchThis = require("../tags/canITouchThis");
const hasTagValue = require("../tags/hasTagValue");

// function resumeableASG(asg) {
//   return hasTag(asg.Tags, "stop:hammertime") && hasTag(asg.Tags, "hammertime:asgsuspend") && canITouchThis(asg.Tags);
// }

function resumeableASG(application) {
  return function suspendableASGFilter(asg) {
    if (application === 'all') {
      return (
        hasTag(asg.Tags, "stop:hammertime") &&
        hasTag(asg.Tags, "hammertime:asgsuspend") &&
        canITouchThis(asg.Tags) && 
        // TODO: this is for testing this is for testing
        hasTagValue(asg.Tags, "Slice", ['auto-w-2-c-636'])
        // TODO: this is for testing this is for testing
      );  
    }
    return (
      hasTag(asg.Tags, "stop:hammertime") &&
      hasTag(asg.Tags, "hammertime:asgsuspend") &&
      canITouchThis(asg.Tags) &&
      hasTag(asg.Tags, "Application") &&
      hasTagValue(asg.Tags, "Application", application) &&
      // TODO: this is for testing this is for testing
      hasTagValue(asg.Tags, "Slice", ['auto-w-2-c-636'])
      // TODO: this is for testing this is for testing
    );
  };
}

function listASGsToResume(currentOperatingTimezone, application) {
  return listTargetASGs({ filter: resumeableASG(application), currentOperatingTimezone });
}

module.exports = listASGsToResume;
