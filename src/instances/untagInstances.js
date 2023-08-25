const { EC2Client, DeleteTagsCommand } = require("@aws-sdk/client-ec2");

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function untagInstances(instanceIds) {
  const options = {
    Resources: instanceIds,
    Tags: [
      {
        Key: 'stop:hammertime',
      },
    ],
  };
  const client = new EC2Client({ region: region });
  return await client.send(new DeleteTagsCommand(options))
    .then(() => instanceIds);
}

module.exports = untagInstances;
