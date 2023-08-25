const { EC2Client, StopInstancesCommand } = require("@aws-sdk/client-ec2");

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function stopInstances(instanceIds) {
  const client = new EC2Client({ region: region });
  return await client.send(new StopInstancesCommand({ InstanceIds: instanceIds }))
    .then(() => instanceIds);
}

module.exports = stopInstances;
