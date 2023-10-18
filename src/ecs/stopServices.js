const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function spinDownService(service) {
  const ECS = new AWS.ECS();
  const params = {
    cluster: service.clusterArn,
    service: service.serviceArn,
    desiredCount: 0,
  };
  return retryWhenThrottled(() => ECS.updateService(params)).then(() => service);
}

function stopServices(services) {
  return Promise.all(services.map(service => spinDownService(service)));
}

module.exports = stopServices;
