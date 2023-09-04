const { ECSClient, UntagResourceCommand } = require('@aws-sdk/client-ecs');
const retryWhenThrottled = require('../utils/retryWhenThrottled.js');

const region = process.env.RQP_REGION || 'ap-southeast-2';

const untagService = async (service) => {
  const client = new ECSClient({ region });
  const params = {
    tagKeys: [
      'hammertime:originalServiceSize',
      'stop:hammertime',
    ],
    resourceArn: service.serviceArn,
  };
  await retryWhenThrottled(async () => await client.send(new UntagResourceCommand(params)));
  return service;
};

const untagServices = (services) => Promise.all(services.map((service) => untagService(service)));

module.exports = untagServices;
