const { RDSClient, DescribeDBInstancesCommand } = require("@aws-sdk/client-rds");

const region = process.env.RQP_REGION || 'ap-southeast-2';

module.exports = async function listAllDBInstances() {
  const client = new RDSClient({ region: region });
  return await client.send(new DescribeDBInstancesCommand());
};
