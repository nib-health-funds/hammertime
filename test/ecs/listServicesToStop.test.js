// const assert = require('assert');
// const AWS = require('aws-sdk-mock');
// const listServicesToStart = require('../../src/ecs/listServicesToStart');
// const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

// describe('listServicesToStart()', () => {
//     it ('returns list of valid services stopped by hammertime', () => {
//         console.log("HELLO!");
//         const mockServices = [
//             {
//                 serviceArn: 'arn:aws:service:ABC123',
//                 serviceName: 'stopped by hammertime',
//                 clusterArn: 'arn:aws:cluster:ABC123',
//                 desiredCount: 2,
//                 launchType: 'FARGATE',
//                 tags: [
//                     {
//                         Key: 'stop:hammertime',
//                         Value: '',
//                     }
//                 ]
//             },
//             {
//                 serviceArn: 'arn:aws:service:ABC1234',
//                 serviceName: 'stopped by hammertime',
//                 clusterArn: 'arn:aws:cluster:ABC1234',
//                 desiredCount: 2,
//                 launchType: 'FARGATE',
//                 tags: [

//                 ]
//             },
//         ]
//         const mockClusters = {
//             clusterArns: [
//                 'arn:aws:cluster:ABC123',
//                 'arn:aws:cluster:ABC1234'
//             ]
//         }

//         const mockListServices = [

//         ]

//         AWS.mock('ECS', 'listClusters', mockClusters);
//         AWS.mock('ECS', 'listServices', mockListServices);
//         AWS.mock('ECS', 'describeServices', mockServices);

//         return listServicesToStart(defaultOperatingTimezone)
//             .then((serviceIds) => {
//                 console.log(serviceIds);
//             })

//     })
// })
