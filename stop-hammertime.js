console.log('Loading function');

AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

async = require('async');

// This should be something to do with slices & env vars?
dryrun = false;

exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var autoscaling = new AWS.AutoScaling();

  if (dryrun) {
    console.warn("Dryrun mode - no actions will be performed\n");
  }

  async.series(
  [function(callback) {
    doEc2(callback);
  },

  function(callback) {
    doAsg(callback);
  }],

  function(err, results) {
    if (err) {
      console.log("Error: " + err);
      context.fail(err);
    } else {
      context.succeed('Done.');
    }
  });

  function doEc2(callback) {
    console.log("Checking EC2 instances");

    var params = {
      DryRun: false,
      Filters: [{
        Name: 'instance-state-name',
        Values: ['running']
      }]
    };

    ec2.describeInstances(params, function(err, data) {
      if (err) {
        console.log("Error: " + err);
        return callback(err, null);
      } else {
        instances = [].concat.apply([], data.Reservations.map(function(reservation) {
          return reservation.Instances;
        })).filter(function(instance) {
          if (tagsContainsKey(instance.Tags, 'aws:autoscaling:groupName') || tagsContainsKey(instance.Tags, 'hammertime:canttouchthis')) {
            return false;
          } else {
            return true;
          }
        });

        if (instances.length > 0) {
          console.log("Instances to stop:");
          instances.forEach(function(instance, i) {
            console.log(instance.InstanceId + ' (' + valueForKey('Name', instance.Tags) + ')');
          });
          console.log('\n');

          instanceToStop = instances.map(function(instance) {
            return instance.InstanceId
          });

          async.series(
          [function(ec2Callback) {
            tagStopTime(instanceToStop, ec2Callback);
          },

          function(ec2Callback) {
            stopEc2Instances(instanceToStop, ec2Callback);
          }],

          function(err, results) {
            if (err) {
              return callback(err, null);
            } else {
              console.log("EC2 done\n");
              callback(null, null);
            }
          });
        } else {
          console.log("No EC2 instances found to stop");
          callback(null, null)
        }
      }
    });
  }

  function filterError(error) {
    returnValue = error;

    if (error == 'DryRunOperation: Request would have succeeded, but DryRun flag is set.') {
      returnValue = null;
    }

    return returnValue;
  }

  function tagStopTime(resources, callback) {
    var params = {
      Resources: resources,
      Tags: [{
        Key: 'stop:hammertime',
        Value: new Date().toISOString()
      }],
      DryRun: dryrun
    };

    console.log('Tagging ' + resources);

    ec2.createTags(params, function(err, data) {
      if (filterError(err)) {
        return callback(err, null);
      } else {
        callback(null, null);
      }
    });
  }

  function stopEc2Instances(instances, callback) {
    var params = {
      InstanceIds: instances,
      DryRun: dryrun,
      Force: false
    };

    console.log('Stopping ' + instances);

    ec2.stopInstances(params, function(err, data) {
      if (filterError(err)) {
        return callback(err, null);
      } else {
        callback(null, null);
      }
    });
  }

  function doAsg(callback) {
    console.log("Checking ASGs");
    var params = {};

    autoscaling.describeAutoScalingGroups(params, function(err, data) {
      if (err) {
        console.log("Error: " + err);
        return callback(err, null);
      } else {
        asgs = data.AutoScalingGroups.filter(function(asg) {
          if (tagsContainsKey(asg.Tags, 'hammertime:canttouchthis')) {
            return false;
          } else {
            return true;
          }
        });

        if (asgs.length > 0) {
          console.log("ASGs to spin down:");
          asgs.forEach(function(asg, i) {
            console.log(asg.AutoScalingGroupName + ' (' + valueForKey('Name', asg.Tags) + ')');
          });
          console.log('\n');

          async.series(
          [function(callback2) {
            tagAsgs(asgs, callback2);
          },

          function(callback2) {
            spinDownAsgs(asgs, callback2)
          }],

          function(err, results) {
            if (err) {
              return callback(err, null);
            } else {
              console.log("ASGs done\n");
              callback(null, null);
            }
          });
        } else {
          console.log("No ASGs found to spin down");
          callback(null, null)
        }
      }
    });
  }

  function tagAsg(asg) {
    return new Promise((resolve, reject) => {
      var params = {
        Tags: [{
          Key: 'hammertime:originalASGSize',
          PropagateAtLaunch: false,
          ResourceId: asg.AutoScalingGroupName,
          ResourceType: 'auto-scaling-group',
          Value: asg.MinSize + ' ' + asg.MaxSize + ' ' + asg.DesiredCapacity
        },
        {
          Key: 'stop:hammertime',
          PropagateAtLaunch: false,
          ResourceId: asg.AutoScalingGroupName,
          ResourceType: 'auto-scaling-group',
          Value: new Date().toISOString()
        }]
      };

      console.log('Tagging and recording original size of ' + asg.AutoScalingGroupName);

      autoscaling.createOrUpdateTags(params, function(err, data) {
        if (filterError(err)) {
          return reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }

  function tagAsgs(asgs, callback) {
    // If we map this
    // Have a promise defined which simply tags
    // done?
    console.log("This is where we test my promises");
    Promise.all(asgs.map(function(asg) {
      console.log("Promising to tag " + asg);
      tagAsg(asg);
    })).then((data) => {
      console.log("I promise they're all tagged");
      callback(null, null);
    }).catch((err) => {
      console.log(err)
      callback(err,null);
    })
  }

  function spinDownAsgs(asgs, local_callback) {
    console.log("This is where we'd spinDownAsgs");
    local_callback("Yeah nah, not ready to test this bit");

    async.each(asgs, function(asg, spinDownAsgCallback) {
      var params = {
        AutoScalingGroupName: asg.AutoScalingGroupName,
        DesiredCapacity: 0,
        MinSize: 0,
      };

      console.log('Spinning down ASG ' + asg.AutoScalingGroupName);

      if (!dryrun) {
        autoscaling.updateAutoScalingGroup(params, function(err, data) {
          if (err) {
            return spinDownAsgCallback(err);
          } else {
            spinDownAsgCallback();
          }
        });
      } else {
        spinDownAsgCallback();
      }
    }, function(err) {
      if (err) {
        return local_callback(err, null);
      } else {
        local_callback(null, null);
      }
    });
  }

  function valueForKey(aKey, tags) {
    returnValue = '';

    tags.forEach(function(tag) {
      if (tag.Key === aKey) {
        returnValue = tag.Value;
      }
    });

    return returnValue;
  }

  function tagsContainsKey(tags, aKey) {
    returnValue = false;

    tags.forEach(function(tag) {
      if (tag.Key === aKey) {
        returnValue = true;
      }
    });

    return returnValue;
  }

};
