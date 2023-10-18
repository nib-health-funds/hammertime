const AWS = require('aws-sdk');
const isInOperatingTimezone = require('../operatingTimezone/isInOperatingTimezone');
const retryWhenThrottled = require('../utils/retryWhenThrottled');

async function getAllClusters(clusters, token) {
  const ECS = new AWS.ECS();
  const params = { nextToken: token };
  const response = await retryWhenThrottled(() => ECS.listClusters(params));
  let clusterArray = [];
  if (clusters) clusterArray = [...clusterArray, ...clusters];
  if (response.clusterArns) clusterArray = [...clusterArray, ...response.clusterArns];
  if (response.nextToken) return getAllClusters(clusterArray, response.nextToken);
  return clusterArray;
}

async function describeAllClusters(clusters) {
  const chunks = chunkArray(clusters, 100);
  const data = await Promise.all(chunks.map(chunk => describeChunkOfClusters(chunk)));
  const clusterArns = [].concat(...data).map(cluster => cluster.clusterArn);
  return clusterArns;
}

async function describeChunkOfClusters(clusters) {
  // Expects no more than 100 clusters.
  const ECS = new AWS.ECS();
  const params = { clusters };
  const response = await retryWhenThrottled(() => ECS.describeClusters(params));
  return response.clusters;
}

async function getAllServices(clusterArnList) {
  const data = await Promise.all(clusterArnList.map(clusterArn => getService(clusterArn)));
  return data.filter(cluster => cluster.services.length > 0);
}

async function getService(clusterArn) {
  const ECS = new AWS.ECS();
  const params = { cluster: clusterArn, launchType: 'FARGATE' };
  const response = await retryWhenThrottled(() => ECS.listServices(params));
  return { cluster: clusterArn, services: response.serviceArns };
}

async function describeServices(clusterList) {
  const services = await Promise.all(clusterList.map(cluster => describeService(cluster)));
  return [].concat(...services);
}

async function describeService(service) {
  const ECS = new AWS.ECS();
  const params = {
    services: service.services,
    cluster: service.cluster,
    include: ['TAGS'],
  };
  const response = await retryWhenThrottled(() => ECS.describeServices(params));
  return response.services;
}

function isServiceInCurrentOperatingTimezone(currentOperatingTimezone) {
  const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
  return service => isInCurrentOperatingTimezone(service.tags);
}

function chunkArray(array, size) {
  if (array.length <= size) return [array];
  return [array.slice(0, size), ...chunkArray(array.slice(size), size)];
}

function filterClusters(filter, currentOperatingTimezone) {
  return getAllClusters([], null)
    .then(data => describeAllClusters(data))
    .then(data => getAllServices(data))
    .then(data => describeServices(data))
    .then(data => data
      .filter(filter)
      .filter(isServiceInCurrentOperatingTimezone(currentOperatingTimezone)));
}

module.exports = filterClusters;
