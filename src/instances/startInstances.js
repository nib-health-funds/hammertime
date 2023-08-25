const { EC2Client, StartInstancesCommand } = require("@aws-sdk/client-ec2");

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function startInstances(instanceIds) {
  const client = new EC2Client({ region: region });
  return await client.send(new StartInstancesCommand({ InstanceIds: instanceIds }))
    .then(() => instanceIds);
}

module.exports = startInstances;
