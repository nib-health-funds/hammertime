const AWS = require('aws-sdk');
const retryWhenThrottled = require('../utils/retryWhenThrottled.js');

const untagService = (service) => {
    const ECS = new AWS.ECS();
    const params = {
        tagKeys: [
            'hammertime:originalServiceSize',
            'stop:hammertime'
        ],
        resourceArn: service.serviceArn
    };
    return retryWhenThrottled(() => ECS.untagResource(params)).then(() => service);
}

const untagServices = (services) => {
    const untagedServices = services.map(service => untagService(service));
    return Promise.all(untagedServices);
}

module.exports = untagServices;