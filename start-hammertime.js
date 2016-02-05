console.log('Loading function');

AWS = require('aws-sdk');
// AWS.config.region = 'ap-southeast-2';
AWS.config.region = 'ap-northeast-1';

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
        Values: ['stopped']
      }, {
        Name: 'tag-key',
        Values: ['stop:hammertime']
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
          // Theoretically we shouldn't have instances that are stopped and part of an ASG, but paranoia
          if (tagsContainsKey(instance.Tags, 'aws:autoscaling:groupName')) {
            return false;
          } else {
            return true;
          }
        });

        if (instances.length > 0) {
          console.log("Instances to start:");
          instances.forEach(function(instance, i) {
            console.log(instance.InstanceId + ' (' + valueForKey('Name', instance.Tags) + ')');
          });
          console.log('\n');

          async.series(
          [function(callback2) {
            startEc2Instances(instances.map(function(instance) {
              return instance.InstanceId
            }), callback2);
          },

          function(callback2) {
            removeHammertimeEC2Tags(instances.map(function(instance) {
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
          console.log("No EC2 instances found to start");
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

  function removeHammertimeEC2Tags(resources, callback) {
    var params = {
      Resources: resources,
      Tags: [{
        Key: 'stop:hammertime'
      }],
      DryRun: dryrun
    };

    console.log('Untagging ' + resources);

    ec2.deleteTags(params, function(err, data) {
      if (filterError(err)) {
        callback(err, null);
      } else {
        callback(null, null);
      }
    });
  }

  function removeHammertimeASGTags(resources, callback) {
    asgs.forEach(function(asg) {
      var params = {
        Tags: [{
          Key: 'hammertime:originalASGSize',
          ResourceId: asg.AutoScalingGroupName,
        },
        {
          Key: 'stop:hammertime',
          ResourceId: asg.AutoScalingGroupName,
        }]
      };

      console.log('Untagging ' + asg.AutoScalingGroupName);

      autoscaling.deleteTags(params, function(err, data) {
        if (filterError(err)) {
          callback(err, null);
        } else {
          callback(null, null);
        }
      });
    });
  }

  function startEc2Instances(instances, callback) {
    var params = {
      InstanceIds: instances,
      DryRun: dryrun
    };

    console.log('Starting ' + instances);

    ec2.startInstances(params, function(err, data) {
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
          if (tagsContainsKey(asg.Tags, 'stop:hammertime')) {
            return true;
          } else {
            return false;
          }
        });

        if (asgs.length > 0) {
          console.log("ASGs to spin up:");
          asgs.forEach(function(asg, i) {
            console.log(asg.AutoScalingGroupName + ' (' + valueForKey('Name', asg.Tags) + ')');
          });
          console.log('\n');

          async.series(
          [function(callback2) {
            spinUpAsgs(asgs, callback2)
          },

          function(callback2) {
            removeHammertimeASGTags(asgs.map(function(asg) {
              return asg.AutoScalingGroupName
            }), callback2);
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
          console.log("No ASGs found to spin up");
          callback(null, null)
        }
      }
    });
  }

  function spinUpAsgs(asgs, callback) {
    async.each(asgs, function(asg, callback2) {
      console.log('Spinning up ASG ' + asg.AutoScalingGroupName);

      originalSize = valueForKey('hammertime:originalASGSize', asg.Tags);

      if (originalSize == null) {
        callback2('ASG tagged with hammertime but original size not tagged', null);
      }

      originalSizeArray = originalSize.split(' ');
      minSize = originalSizeArray[0];
      maxSize = originalSizeArray[1];
      desiredCapacity = originalSizeArray[2];

      var params = {
        AutoScalingGroupName: asg.AutoScalingGroupName,
        MinSize: minSize,
        MaxSize: maxSize,
        DesiredCapacity: desiredCapacity
      };

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