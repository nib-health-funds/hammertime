const { ECSClient, TagResourceCommand } = require("@aws-sdk/client-ecs");
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

async function tagService(service) {
  const client = new ECSClient({ region: region });
  const params = {
    resourceArn: service.serviceArn,
    tags: [
      { key: 'hammertime:originalServiceSize', value: service.desiredCount.toString() },
      { key: 'stop:hammertime', value: new Date().toISOString() },
    ],
  };
  await retryWhenThrottled(async () => await client.send(new TagResourceCommand(params)));
  return service;
}

function tagServices(services) {
  return Promise.all(services.map(service => tagService(service)));
}

module.exports = tagServices;
