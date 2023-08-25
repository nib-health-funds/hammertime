const { RDSClient, ListTagsForResourceCommand } = require("@aws-sdk/client-rds");

const region = process.env.RQP_REGION || 'ap-southeast-2';

function notUntouchable(data) {
  return !(data.TagList.some(tag => tag.Key === 'hammertime:canttouchthis'));
};

module.exports = async function notTaggedUntouchable(arn) {
  const params = {
    ResourceName: arn
  };
  const client = new RDSClient({region: region});
  return await client.send(new ListTagsForResourceCommand(params))
    .then(data => {
      if (notUntouchable(data))
        return arn;
      else {
        return null;
      }
    });
};
