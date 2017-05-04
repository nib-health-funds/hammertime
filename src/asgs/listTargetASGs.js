const AWS = require('aws-sdk');

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

module.exports = function listTargetASGs(filter) {
  return getAllASGs().then(allASGs => allASGs.filter(filter));
};
