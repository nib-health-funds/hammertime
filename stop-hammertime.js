console.log('Loading function');

AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

async = require('async');

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
        callback(err, null);
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

          async.series(
          [function(callback2) {
            tagStopTime(instances.map(function(instance) {
              return instance.InstanceId
            }), callback2);
          },

          function(callback2) {
            stopEc2Instances(instances.map(function(instance) {
              return instance.InstanceId
            }), callback2);
          }],

          function(err, results) {
            if (err) {
              callback(err, null);
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
        callback(err, null);
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
        callback(err, null);
      } else {
        callback(null, null);
      }
    });
  }

  function doAsg(callback) {
    var params = {};

    autoscaling.describeAutoScalingGroups(params, function(err, data) {
      if (err) {
        console.log("Error: " + err);
        callback(err, null);
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
            tagAsg(asgs, callback2);
          },

          function(callback2) {
            spinDownAsgs(asgs, callback2)
          }],

          function(err, results) {
            if (err) {
              callback(err, null);
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

  function tagAsg(asgs, callback) {
    asgs.forEach(function(asg) {
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
          callback(err, null);
        } else {
          callback(null, null);
        }
      });
    });
  }

  function spinDownAsgs(asgs, callback) {
    async.each(asgs, function(asg, callback2) {
      var params = {
        AutoScalingGroupName: asg.AutoScalingGroupName,
        DesiredCapacity: 0,
        MinSize: 0,
      };

      console.log('Spinning down ASG ' + asg.AutoScalingGroupName);

      if (!dryrun) {
        autoscaling.updateAutoScalingGroup(params, function(err, data) {
          if (err) {
            callback2(err);
          } else {
            callback2();
          }
        });
      } else {
        callback2();
      }
    }, function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, null);
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
