const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

function tagService(service) {
    const ECS = new AWS.ECS();
    const params = {
        resourceArn: service.serviceArn,
        tags: [
            { key: 'hammertime:originalServiceSize', value: service.desiredCount.toString() },
            { key: 'stop:hammertime', value: new Date().toISOString() }     
        ]
    }
    return retryWhenThrottled(() => ECS.tagResource(params)).then(() => service);
}

function tagServices(services) {
    const taggedServices = services.map(service => tagService(service));
    return Promise.all(taggedServices);
}

module.exports = tagServices;
