const { ECSClient, UpdateServiceCommand } = require('@aws-sdk/client-ecs');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function startService(service) {
  const client = new ECSClient({ region });
  const originalServiceSize = service.tags.find((tag) => tag.key === 'hammertime:originalServiceSize').value;
  const params = {
    cluster: service.clusterArn,
    service: service.serviceArn,
    desiredCount: originalServiceSize,
  };
  await retryWhenThrottled(async () => await client.send(new UpdateServiceCommand(params)));
  return service;
}

function startServices(services) {
  return Promise.all(services.map((service) => startService(service)));
}

module.exports = startServices;
