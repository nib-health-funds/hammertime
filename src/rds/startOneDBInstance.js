const { RDSClient, StartDBInstanceCommand } = require('@aws-sdk/client-rds');

const region = process.env.RQP_REGION || 'ap-southeast-2';

module.exports = async function startOneDBInstance(arn) {
  const client = new RDSClient({ region: region });

  const instanceId = arn.split(':').pop();
  console.log(`Starting ${instanceId} ...`);
  return client.send(new StartDBInstanceCommand({
    DBInstanceIdentifier: instanceId,
  }))
    .then(() => arn);
};
