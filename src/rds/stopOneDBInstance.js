const { RDSClient, StopDBInstanceCommand } = require("@aws-sdk/client-rds");

const region = process.env.RQP_REGION || 'ap-southeast-2';

module.exports = async function stopOneDBInstance(arn) {
  const client = new RDSClient({region: region});

  var instanceId = arn.split(':').pop();
  console.log("Stopping " + instanceId + " ...");
  return await client.send(new StopDBInstanceCommand({
      DBInstanceIdentifier: instanceId
    }))
    .then(() => arn);
};
