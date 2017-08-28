const AWS = require('aws-sdk');

function hammertimeStop(data) {
  return (data.TagList.some(tag => tag.Key === 'hammertime:stop'));
}

module.exports = function taggedHammertimeStop(arn) {
  const params = {
    ResourceName: arn
  };
  return new Promise((resolve, reject) => {
    const rds = new AWS.RDS();
    rds.listTagsForResource(params)
      .promise()
      //.then(() => resolve(arn))
      .then(data => {
        if (hammertimeStop(data))
          resolve(arn);
        else {
          resolve(null);
        }
      })
      .catch(reject);
  });
};
