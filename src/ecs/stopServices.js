const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled.js');

const spinDownService = (service) => {
    const ECS = new AWS.ECS();
    const params = {
        cluster: service.clusterArn,
        service: service.serviceArn,
        desiredCount: 0
    };
    return retryWhenThrottled(() => ECS.updateService(params)).then(() => service);
}

const stopServices = (services) => {
    const stoppedServices = services.map(service => spinDownService(service));
    return Promise.all(stoppedServices);
}

module.exports = stopServices;
