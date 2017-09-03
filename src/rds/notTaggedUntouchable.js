const AWS = require('aws-sdk');

function notUntouchable(data) {
  return !(data.TagList.some(tag => tag.Key === 'hammertime:canttouchthis'));
};

module.exports = function notTaggedUntouchable(arn) {
  const params = {
    ResourceName: arn
  };
  const rds = new AWS.RDS();
  return rds.listTagsForResource(params)
    .promise()
    .then(data => {
      if (notUntouchable(data))
        return arn;
      else {
        return null;
      }
    });
};
