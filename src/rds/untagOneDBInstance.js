const { RDSClient, RemoveTagsFromResourceCommand } = require('@aws-sdk/client-rds');

const region = process.env.RQP_REGION || 'ap-southeast-2';

module.exports = async function untagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    TagKeys: ['hammertime:stop'],
  };
  const client = new RDSClient({ region });
  return await client.send(new RemoveTagsFromResourceCommand(params))
    .then(() => arn);
};
