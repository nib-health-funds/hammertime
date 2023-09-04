const { AutoScalingClient, DeleteTagsCommand } = require('@aws-sdk/client-auto-scaling');
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const createTag = require('../utils/createTag');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function untagASG(asg) {
  const client = new AutoScalingClient({ region });
  const params = {
    Tags: [
      createTag('hammertime:originalASGSize', asg.AutoScalingGroupName, 'auto-scaling-group'),
      createTag('stop:hammertime', asg.AutoScalingGroupName, 'auto-scaling-group'),
    ],
  };

  await retryWhenThrottled(async () => client.send(new DeleteTagsCommand(params)));
  return asg;
}

function untagASGs(asgs) {
  const untaggedASGs = asgs.map((asg) => untagASG(asg));
  return Promise.all(untaggedASGs);
}

module.exports = untagASGs;
