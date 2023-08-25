const { ECSClient, UpdateServiceCommand } = require("@aws-sdk/client-ecs");
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function spinDownService(service) {
  const client = new ECSClient({ region: region });
  const params = {
    cluster: service.clusterArn,
    service: service.serviceArn,
    desiredCount: 0,
  };
  await retryWhenThrottled(async () => await client.send(new UpdateServiceCommand(params)));
  return service;
}

function stopServices(services) {
  return Promise.all(services.map(service => spinDownService(service)));
}

module.exports = stopServices;
