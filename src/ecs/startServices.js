const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const startService = (service) => {
    const ECS = new AWS.ECS();
    const originalServiceSize = service.tags.find(tag => tag.key === 'hammertime:originalServiceSize').value;

    const params = {
        cluster: service.clusterArn,
        service: service.serviceArn,
        desiredCount: originalServiceSize
    };
    return retryWhenThrottled(() => ECS.updateService(params)).then(() => service);
}

const startServices = (services) => {
    const startedServices = services.map(service => startService(service));
    return Promise.all(startedServices);
}

module.exports = startServices
