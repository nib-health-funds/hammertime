const AWS = require('aws-sdk');

function notUntouchable(data) {
  return !(data.TagList.some(tag => tag.Key === 'hammertime:canttouchthis'));
};

module.exports = function notTaggedUntouchable(arn) {
  const params = {
    ResourceName: arn
  };
  return new Promise((resolve, reject) => {
    const rds = new AWS.RDS();
    rds.listTagsForResource(params)
      .promise()
      .then(data => {
        if (notUntouchable(data))
          resolve(arn);
        else {
          resolve(null);
        }
      })
      .catch(reject);
  });
};
