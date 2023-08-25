const { EC2Client, CreateTagsCommand } = require("@aws-sdk/client-ec2");

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function tagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
        Value: new Date().toISOString(),
      },
    ],
  };
  const client = new EC2Client({ region: region });
  return await client.send(new CreateTagsCommand(options))
    .then(() => instanceIds);
}

module.exports = tagInstances;
