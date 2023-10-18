const AWS = require('aws-sdk');

function hammertimeStop(data) {
  return (data.TagList.some(tag => tag.Key === 'hammertime:stop'));
}

module.exports = function taggedHammertimeStop(arn) {
  const params = {
    ResourceName: arn
  };
  const rds = new AWS.RDS();
  return rds.listTagsForResource(params)
    .promise()
    .then(data => {
      if (hammertimeStop(data))
        return arn;
      else {
        return null;
      }
    });
};
