const AWS = require('aws-sdk');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone.js');
const retryWhenThrottled = require('../utils/retryWhenThrottled.js');

function getAllClusters() {
    const ECS = new AWS.ECS();
    const params = {};

    function followClusterPages(allClusters, data) {
        const combinedClusters = [...allClusters, ...data.clusterArns];
        if (data.NextToken) {
            params.NextToken = data.NextToken;
            return retryWhenThrottled(() => 
                ECS.describeClusters(params)
                    .then(res => followClusterPages(combinedClusters, res)
            ));
        }
        return Promise.resolve(combinedClusters);
    }
    return retryWhenThrottled(() => ECS.listClusters(params)).then(data => followClusterPages([], data))
}

const getAllServices = (clusterArnList) => {
    const promises = [];
    clusterArnList.map((clusterArn) => {
        promises.push(getService(clusterArn));
    })
    return Promise.all(promises);
}

const getService = (clusterArn) => {
    const ECS = new AWS.ECS();
    const params = { cluster: clusterArn, launchType: 'FARGATE' }; // Only impact fargate services.
    return retryWhenThrottled(() => 
        ECS.listServices(params))
            .then(data => ({ services: buildListOfServices(data.serviceArns), cluster: clusterArn })
    );
}

const buildListOfServices = (serviceArns) => {
    let cleanedServiceArns = [];
    serviceArns.map((service) => {
        cleanedServiceArns = cleanedServiceArns.concat(service);
    })
    return cleanedServiceArns;
}

const describeServices = (serviceDetails) => {
    const promises = [];
    serviceDetails.map((service) => {
        if (service.services.length > 0)
            promises.push(describeService(service));
    })
    return Promise.all(promises);
}

const describeService = (service) => {
    const ECS = new AWS.ECS();
    const params = { 
        services: service.services,
        cluster: service.cluster,
        include: [ 'TAGS' ]
    };
    return retryWhenThrottled(() => ECS.describeServices(params))
}

const chunkServicesTogether = (services) => {
    const chunkedServices = [];
    services.map((cluster) => {
        cluster.services.map((service) => {
            chunkedServices.push(service);
        })
    })
    return chunkedServices;
}

const isServiceInCurrentOperatingTimezone = (currentOperatingTimezone) => {
    const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
    return service => {
        return isInCurrentOperatingTimezone(service.tags);
    }

}

const filterClusters = (filter, currentOperatingTimezone) => {
    return getAllClusters()
    .then((data) => {
        return getAllServices(data);
    }) 
    .then((data) => {
        return describeServices(data);
    })
    .then((data) => {
        return chunkServicesTogether(data);
    })
    .then((data) => {
        return data
            .filter(filter)
            .filter(isServiceInCurrentOperatingTimezone(currentOperatingTimezone));
    })
}

module.exports = filterClusters
