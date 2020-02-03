const startASGs = require('./asgs/startASGs');
const listASGsToStart = require('./asgs/listASGsToStart');
const untagASGs = require('./asgs/untagASGs');
const startInstances = require('./instances/startInstances');
const listInstancesToStart = require('./instances/listInstancesToStart');
const untagInstances = require('./instances/untagInstances');
const listDBInstancesToStart = require('./rds/listDBInstancesToStart');
const startDBInstances = require('./rds/startDBInstances');
const untagDBInstances = require('./rds/untagDBInstances');
const listServicesToStart = require('./ecs/listServicesToStart');
const startServices = require('./ecs/startServices');
const untagServices = require('./ecs/untagServices');

function startAllInstances({ dryRun, currentOperatingTimezone }) {
  return listInstancesToStart(currentOperatingTimezone)
    .then((startableInstances) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any instances.');
        console.log(`Found the following ${startableInstances.length} instances that would have been to started`);
        startableInstances.forEach((instance) => {
          console.log(instance);
        });

        return [];
      }

      if (startableInstances.length === 0) {
        console.log('No instances found to start, moving on...');
        return [];
      }

      console.log(`Found the following ${startableInstances.length} instances to start ...`);
      startableInstances.forEach((instance) => {
        console.log(instance);
      });

      return startInstances(startableInstances).then((startedInstanceIds) => {
        console.log('Finished starting instances. Moving on to untag them.');
        return untagInstances(startedInstanceIds);
      });
    });
}

function spinUpASGs({ dryRun, currentOperatingTimezone }) {
  return listASGsToStart(currentOperatingTimezone)
    .then((startableASGs) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any ASGs.');
        console.log(`Found the following ${startableASGs.length} auto scaling groups that would have been spun up`);
        startableASGs.forEach((asg) => {
          console.log(asg.AutoScalingGroupName);
        });
        return [];
      }

      if (startableASGs.length === 0) {
        console.log('No ASGs to spin up, moving on...');
        return [];
      }

      console.log(`Found the following ${startableASGs.length} auto scaling groups to spin up...`);
      startableASGs.forEach((asg) => {
        console.log(asg.AutoScalingGroupName);
      });

      return startASGs(startableASGs).then((startedASGs) => {
        console.log(`Finished spinning up ASGs. Moving on to untag ${startedASGs.length} of them.`);
        return untagASGs(startedASGs);
      });
    });
}

function startAllDBInstances(dryRun) {
  return listDBInstancesToStart()
    .then((arns) => {
      if (dryRun) {
        console.log('Dry run is enabled, will not start or untag any RDS instances.');
        return [];
      }
      return arns;
    })
    .then((arns) => {
      if (arns.length === 0) {
        console.log('There are no RDS instances to start today. See you the next time.');
        return [];
      }

      return startDBInstances(arns)
        .then((startedDBInstanceARNs) => {
          console.log('Finished starting RDS instances. Moving on to untag them.');
          return untagDBInstances(startedDBInstanceARNs);
        });
    })
    .then((arns) => {
      if (arns.length > 0) {
        console.log('Finished tagging RDS instances.');
      }
    });
}

function spinUpServices({ dryRun, currentOperatingTimezone }){
  return listServicesToStart(currentOperatingTimezone)
  .then((startableServices) => {
    if (dryRun) {
      console.log('Dry run is enabled, will not start or untag any services.');
      console.log(`Found the following ${startableServices.length} service[s] that would have been spun up`);
      startableServices.map((service) => console.log(service.serviceName));
      return [];
    }

    if (startableServices.length === 0) {
      console.log('No instances found to start, moving on...');
      return [];
    }

    console.log(`Found the following ${startableServices.length} services[s] to start...`);
    startableServices.map((service) => console.log(service.serviceName));

    return startServices(startableServices).then((startedServiceIds) => {
      console.log('Finished starting service[s]. Moving on to untag them.');
      return untagServices(startedServiceIds);
    })
  });
}

module.exports = function start(options) {
  const { event, callback, dryRun } = options;
  const currentOperatingTimezone = event.currentOperatingTimezone;
  console.log(`Hammertime start for ${currentOperatingTimezone}`);
  Promise.all([
    startAllDBInstances(dryRun),
    startAllInstances({ dryRun, currentOperatingTimezone }),
    spinUpASGs({ dryRun, currentOperatingTimezone }),
    spinUpServices({ dryRun, currentOperatingTimezone })
  ]).then(() => {
    if (!dryRun) {
      console.log('All EC2, RDS instances, ASGs, and ECS services started successfully. Good morning!');
    }
    callback(null, {
      message: 'Start: Hammertime successfully completed.',
    }, event);
  }).catch((err) => {
    console.error(err);
    callback(err);
  });
};
