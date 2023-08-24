const { AutoScalingClient, CreateOrUpdateTagsCommand } = require("@aws-sdk/client-auto-scaling");
const retryWhenThrottled = require('../utils/retryWhenThrottled');
const createTag = require('../utils/createTag');

const region = process.env.RQP_REGION || 'ap-southeast-2';

function tagASG(asg) {
  const client = new AutoScalingClient({ region:region });
  const params = {
    Tags: [
      createTag('hammertime:originalASGSize', asg.AutoScalingGroupName, 'auto-scaling-group', `${asg.MinSize},${asg.MaxSize},${asg.DesiredCapacity}`),
      createTag('stop:hammertime', asg.AutoScalingGroupName, 'auto-scaling-group', new Date().toISOString()),
    ],
  };

  return retryWhenThrottled(async () => await client.send(new CreateOrUpdateTagsCommand(params)))
    .then(() => asg);
}

function tagASGs(asgs) {
  const taggedASGs = asgs.map(asg => tagASG(asg));
  return Promise.all(taggedASGs);
}

module.exports = tagASGs;
