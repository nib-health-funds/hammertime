const AWS = require("aws-sdk");
const retryWhenThrottled = require("../utils/retryWhenThrottled");
// const createTag = require('../utils/createTag');
const deleteTagParams = require("../utils/deleteTagParams");

function untagASG(asg) {
  const autoscaling = new AWS.AutoScaling();
  const params = {
    Tags: [
      deleteTagParams(
        "stop:hammertime",
        asg.AutoScalingGroupName,
        "auto-scaling-group"
      ),
    ],
  };
  return retryWhenThrottled(() => autoscaling.deleteTags(params)).then(
    () => asg
  );
}

function untagResumedASGs(asgs) {
  const untaggedASGs = asgs.map((asg) => untagASG(asg));
  return Promise.all(untaggedASGs).catch((error) => {
    console.log("untagResumedASGs - Broken Promise here:", error);
  });
}

module.exports = untagResumedASGs;
