const { AutoScalingClient, DescribeAutoScalingGroupsCommand } = require('@aws-sdk/client-auto-scaling');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function getAllASGs() {
  const client = new AutoScalingClient({ region: region });
  const params = {};

  async function followASGPages(allAsgs, data) {
    const combinedAsgs = [...allAsgs, ...data.AutoScalingGroups];

    if (data.NextToken) {
      params.NextToken = data.NextToken;
      return client.send(new DescribeAutoScalingGroupsCommand(params))
        .then((res) => followASGPages(combinedAsgs, res));
    }

    return Promise.resolve(combinedAsgs);
  }

  return client.send(new DescribeAutoScalingGroupsCommand(params))
    .then((data) => followASGPages([], data));
}

function isASGInCurrentOperatingTimezone(currentOperatingTimezone) {
  const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
  return (asg) => isInCurrentOperatingTimezone(asg.Tags);
}

module.exports = async function listTargetASGs({ filter, currentOperatingTimezone }) {
  const allASGs = await getAllASGs();
  return allASGs.filter(filter)
    .filter(isASGInCurrentOperatingTimezone(currentOperatingTimezone));
};
