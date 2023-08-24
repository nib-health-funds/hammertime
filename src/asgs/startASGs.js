const { AutoScalingClient, UpdateAutoScalingGroupCommand } = require("@aws-sdk/client-auto-scaling");
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const valueForKey = require('../utils/valueForKey');

const region = process.env.RQP_REGION || 'ap-southeast-2';

function spinUpASG(asg) {
  const client = new AutoScalingClient({ region:region });
  const originalASGSize = valueForKey(asg.Tags, 'hammertime:originalASGSize').split(',');
  const params = {
    AutoScalingGroupName: asg.AutoScalingGroupName,
    MinSize: originalASGSize[0],
    MaxSize: originalASGSize[1],
    DesiredCapacity: originalASGSize[2],
  };

  return retryWhenThrottled(async () => await client.send(new UpdateAutoScalingGroupCommand(params)))
    .then(() => asg);
}

function startASGs(asgs) {
  const startedASGs = asgs.map(asg => spinUpASG(asg));
  return Promise.all(startedASGs);
}

module.exports = startASGs;
