const { RDSClient, ListTagsForResourceCommand } = require('@aws-sdk/client-rds');

const region = process.env.RQP_REGION || 'ap-southeast-2';

function hammertimeStop(data) {
  return (data.TagList.some((tag) => tag.Key === 'hammertime:stop'));
}

module.exports = async function taggedHammertimeStop(arn) {
  const params = {
    ResourceName: arn,
  };
  const client = new RDSClient({ region: region });
  return client.send(new ListTagsForResourceCommand(params))
    .then((data) => {
      if (hammertimeStop(data)) return arn;

      return null;
    });
};
