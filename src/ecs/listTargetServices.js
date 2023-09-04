const {
  ECSClient, ListClustersCommand, DescribeClustersCommand, ListServicesCommand, DescribeServicesCommand,
} = require('@aws-sdk/client-ecs');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

const region = process.env.RQP_REGION || 'ap-southeast-2';

function chunkArray(array, size) {
  if (array.length <= size) return [array];
  return [array.slice(0, size), ...chunkArray(array.slice(size), size)];
}

async function getService(clusterArn) {
  const client = new ECSClient({ region });
  const params = { cluster: clusterArn, launchType: 'FARGATE' };
  const response = await retryWhenThrottled(async () => client.send(new ListServicesCommand(params)));
  return { cluster: clusterArn, services: response.serviceArns };
}

async function describeChunkOfClusters(clusters) {
  // Expects no more than 100 clusters.
  const client = new ECSClient({ region });
  const params = { clusters };
  const response = await retryWhenThrottled(async () => client.send(new DescribeClustersCommand(params)));
  return response.clusters;
}

async function describeService(service) {
  const client = new ECSClient({ region });
  const params = {
    services: service.services,
    cluster: service.cluster,
    include: ['TAGS'],
  };
  const response = await retryWhenThrottled(async () => client.send(new DescribeServicesCommand(params)));
  return response.services;
}

async function getAllClusters(clusters, token) {
  const client = new ECSClient({ region });
  const params = { nextToken: token };
  const response = await retryWhenThrottled(async () => client.send(new ListClustersCommand(params)));
  let clusterArray = [];
  if (clusters) clusterArray = [...clusterArray, ...clusters];
  if (response.clusterArns) clusterArray = [...clusterArray, ...response.clusterArns];
  if (response.nextToken) return getAllClusters(clusterArray, response.nextToken);
  return clusterArray;
}

async function describeAllClusters(clusters) {
  const chunks = chunkArray(clusters, 100);
  const data = await Promise.all(chunks.map((chunk) => describeChunkOfClusters(chunk)));
  const clusterArns = [].concat(...data).map((cluster) => cluster.clusterArn);
  return clusterArns;
}

async function getAllServices(clusterArnList) {
  const data = await Promise.all(clusterArnList.map((clusterArn) => getService(clusterArn)));
  return data.filter((cluster) => cluster.services.length > 0);
}

async function describeServices(clusterList) {
  const services = await Promise.all(clusterList.map((cluster) => describeService(cluster)));
  return [].concat(...services);
}

function isServiceInCurrentOperatingTimezone(currentOperatingTimezone) {
  const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
  return (service) => isInCurrentOperatingTimezone(service.tags);
}

async function filterClusters(filter, currentOperatingTimezone) {
  const data = await getAllClusters([], null);
  const data_1 = await describeAllClusters(data);
  const data_2 = await getAllServices(data_1);
  const data_3 = await describeServices(data_2);
  return data_3.filter(filter)
    .filter(isServiceInCurrentOperatingTimezone(currentOperatingTimezone));
}

module.exports = filterClusters;
