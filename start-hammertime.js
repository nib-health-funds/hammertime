console.log('Loading function');

AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

async = require('async');

dryrun = true;


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
      },
      {
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
          if (tagsContainsKey(instance.Tags, 'aws:autoscaling:groupName') {
            return false;
          } else {
            return true;
          }
        });

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
          removeHammertimeTag(instances.map(function(instance) {
            return instance.InstanceId
          }), callback2);
        }
      ],
        function(err, results) {
          if (err) {
            callback(err, null);
          } else {
            console.log("EC2 done\n");
            callback(null, null);
          }
        });
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

  function removeHammertimeTag(resources, callback) {
    var params = {
      Resources: resources,
      Tags: [{
        Key: 'stop:hammertime'
      }],
      DryRun: dryrun
    };

    console.log('Tagging ' + resources);

    ec2.deleteTags(params, function(err, data) {
      if (filterError(err)) {
        callback(err, null);
      } else {
        callback(null, null);
      }
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

        console.log("ASGs to spin up:");
        asgs.forEach(function(asg, i) {
          console.log(asg.AutoScalingGroupName + ' (' + valueForKey('Name', asg.Tags) + ')');
        });
        console.log('\n');

        async.series(
        [function(callback2) {
          tagStopTime(asgs.map(function(asg) {
            return asg.AutoScalingGroupName
          }), callback2);
        },

        function(callback2) {
          tagAsgSize(asgs, callback2);
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
      }
    });
  }

  function tagAsgSize(asgs, callback) {
    asgs.forEach(function(asg) {
      var params = {
        Resources: [asg.AutoScalingGroupName],
        Tags: [{
          Key: 'hammertime:originalASGSize',
          Value: asg.MinSize + ' ' + asg.MaxSize + ' ' + asg.DesiredCapacity
        }],
        DryRun: dryrun
      };

      console.log('Recording original size of ' + asg.AutoScalingGroupName);

      ec2.createTags(params, function(err, data) {
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