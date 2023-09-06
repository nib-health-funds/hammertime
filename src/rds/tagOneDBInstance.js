const { RDSClient, AddTagsToResourceCommand } = require('@aws-sdk/client-rds');

const region = process.env.RQP_REGION || 'ap-southeast-2';

module.exports = async function tagOneDBInstance(arn) {
  const params = {
    ResourceName: arn,
    Tags: [{
      Key: 'hammertime:stop',
      Value: new Date().toISOString(),
    }],
  };
  const client = new RDSClient({ region: region });
  return client.send(new AddTagsToResourceCommand(params))
    .then(() => arn);
};
