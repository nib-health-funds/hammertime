// const assert = require('assert');
// const AWS = require('aws-sdk-mock');
// const listServicesToStart = require('../../src/ecs/listServicesToStart');
// const defaultOperatingTimezone = require('../../src/config').defaultOperatingTimezone;

// describe('listServicesToStart()', () => {
// //   it('returns list of asgs spun down by hammertime', () => {
// //     AWS.mock('AutoScaling', 'describeAutoScalingGroups', startOnePageResponse);

// //     return listASGsToStart(defaultOperatingTimezone)
// //       .then((validAsgs) => {
// //         assert.equal(validAsgs.length, 1);
// //         assert.equal(validAsgs[0].AutoScalingGroupName, 'can-touch-this-asg-page-2');
// //       });
// //   });

// //   it('returns an empty list if no services found', () => {
// //     AWS.mock('ECS', 'describeClusters', emptyListClusters);

// //     return listServicesToStart(defaultOperatingTimezone)
// //         .then((servicesToStart) => {
// //             assert.deepEqual(servicesToStart, []);
// //         });
// //   });

//   it('returns a list of services spun down by hammertime', () => {
//     AWS.mock('ECS', 'describeServices', describeServices());
//     AWS.mock('ECS', 'describeClusters', describeClusters);
//     AWS.mock('ECS', 'listClusters', listClusters);
//     AWS.mock('ECS', 'listServices', listServices("arn:aws:ecs:cluster-1"));

//     return listServicesToStart(defaultOperatingTimezone)
//         .then((servicesToStart) => {
//             console.log("SERVICES TO START!");
//             console.log(servicesToStart);
//         })



//   })


// //   it('returns an empty list if no asgs found', () => {
// //     AWS.mock('AutoScaling', 'describeAutoScalingGroups', emptyResponse);
// //     return listASGsToStart(defaultOperatingTimezone)
// //       .then((validAsgs) => {
// //         assert.deepEqual(validAsgs, []);
// //       });
// //   });

// //   afterEach(() => {
// //     AWS.restore('AutoScaling', 'describeAutoScalingGroups');
// //   });
// });


// const emptyListClusters = {
//     "clusterArns": [

//     ]
// }


// const listClusters = {
//     "clusterArns": [
//         "arn:aws:ecs:cluster-1",
//         "arn:aws:ecs:cluster-2",
//         "arn:aws:ecs:cluster-3",
//         "arn:aws:ecs:cluster-4"
//     ]
// }

// const describeClusters = {
//     "clusters": [
//         {
//             "clusterArn": "arn:aws:ecs:cluster-1",
//             "clusterName": "cluster-1",
//             "registeredContainerInstancesCount": 0,
//             "runningTasksCount": 2,
//             "pendingTasksCount": 0,
//             "activeServicesCount": 1,
//             "tags": [

//             ]
//         },
//         {
//             "clusterArn": "arn:aws:ecs:cluster-2",
//             "clusterName": "cluster-2",
//             "registeredContainerInstancesCount": 0,
//             "runningTasksCount": 2,
//             "pendingTasksCount": 0,
//             "activeServicesCount": 1,
//             "tags": [

//             ]
//         },
//         {
//             "clusterArn": "arn:aws:ecs:cluster-3",
//             "clusterName": "cluster-3",
//             "registeredContainerInstancesCount": 0,
//             "runningTasksCount": 2,
//             "pendingTasksCount": 0,
//             "activeServicesCount": 1,
//             "tags": [

//             ]
//         },
//         {
//             "clusterArn": "arn:aws:ecs:cluster-3",
//             "clusterName": "cluster-3",
//             "registeredContainerInstancesCount": 0,
//             "runningTasksCount": 2,
//             "pendingTasksCount": 0,
//             "activeServicesCount": 1,
//             "tags": [

//             ]
//         }
//     ]
// }

// const listServices = (clusterId) => {
//     console.log("TRIGGERED!");
//     console.log(clusterId);

//     switch(clusterId) {
//         case "arn:aws:ecs:cluster-1":
//             return {
//                 "serviceArns": [
//                     "arn:aws:ecs:service-1",
//                     "arn:aws:ecs:service-2"
//                 ]
//             }

//         case "arn:aws:ecs:cluster-2":
//             return {
//                 "serviceArns": [
//                     "arn:aws:ecs:service-3",
//                     "arn:aws:ecs:service-4"
//                 ]
//             }

//         default:
//             return {
//                 "serviceArns": [ ]
//             }
//     }
// }

// const describeServices = () => {
//     console.log("Describing a service!");
//     return {
//         "services": [
//             {
//                 "serviceArn": "arn:aws:ecs:service-1",
//                 "serviceName": "service-1",
//                 "desiredCount": 2,
//                 "runningCount": 2,
//                 "launchType": "FARGATE",
//             },
//             {
//                 "serviceArn": "arn:aws:ecs:service-2",
//                 "serviceName": "service-2",
//                 "desiredCount": 2,
//                 "runningCount": 2,
//                 "launchType": "FARGATE",
//             },
//         ],
//         "failures": []   
        
//     }

// }