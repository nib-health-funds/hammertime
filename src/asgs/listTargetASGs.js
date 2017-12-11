const AWS = require('aws-sdk');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone');

function getAllASGs() {
  const autoscaling = new AWS.AutoScaling();
  const params = {};

  function followASGPages(allAsgs, data) {
    const combinedAsgs = [...allAsgs, ...data.AutoScalingGroups];

    if (data.NextToken) {
      params.NextToken = data.NextToken;
      return autoscaling.describeAutoScalingGroups(params)
        .promise()
        .then(res => followASGPages(combinedAsgs, res));
    }

    return Promise.resolve(combinedAsgs);
  }

  return autoscaling.describeAutoScalingGroups(params)
    .promise()
    .then(data => followASGPages([], data));
}

function isInCurrentOperatingTimezone(currentOperatingTimezone) {
  return (asg) => {
    const inOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone)(asg.Tags);
    if (inOperatingTimezone) {
      console.log('Found asg in current operating timezone: ', asg);
    }
    return inOperatingTimezone;
  };
}

module.exports = function listTargetASGs({ filter, currentOperatingTimezone }) {
  return getAllASGs()
          .then(allASGs => allASGs.filter(filter)
                                  .filter(isInCurrentOperatingTimezone(currentOperatingTimezone)));
};
