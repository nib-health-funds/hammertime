const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function startService(service) {
  const ECS = new AWS.ECS();
  const originalServiceSize = service.tags.find(tag => tag.key === 'hammertime:originalServiceSize').value;
  const params = {
    cluster: service.clusterArn,
    service: service.serviceArn,
    desiredCount: originalServiceSize,
  };
  return retryWhenThrottled(() => ECS.updateService(params)).then(() => service);
}

function startServices(services) {
  return Promise.all(services.map(service => startService(service)));
}

module.exports = startServices;
