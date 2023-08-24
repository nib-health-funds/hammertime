const { AutoScalingClient, UpdateAutoScalingGroupCommand } = require("@aws-sdk/client-auto-scaling");
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

function spinDownASG(asg) {
  const client = new AutoScalingClient({ region:region });
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    DesiredCapacity: 0,
    MinSize: 0,
  };

  return retryWhenThrottled(async () => await client.send(new UpdateAutoScalingGroupCommand(params)))
    .then(() => asg);
}

function stopASGs(asgs) {
  const stoppedASGs = asgs.map(asg => spinDownASG(asg));
  return Promise.all(stoppedASGs);
}

module.exports = stopASGs;
