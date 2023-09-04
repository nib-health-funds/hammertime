const { AutoScalingClient, UpdateAutoScalingGroupCommand } = require('@aws-sdk/client-auto-scaling');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function spinDownASG(asg) {
  const client = new AutoScalingClient({ region });
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    DesiredCapacity: 0,
    MinSize: 0,
  };

  await retryWhenThrottled(async () => await client.send(new UpdateAutoScalingGroupCommand(params)));
  return asg;
}

function stopASGs(asgs) {
  const stoppedASGs = asgs.map((asg) => spinDownASG(asg));
  return Promise.all(stoppedASGs);
}

module.exports = stopASGs;
