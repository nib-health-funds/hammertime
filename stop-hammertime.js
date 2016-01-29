console.log('Loading function');

AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

async = require('async');


exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var autoscaling = new AWS.AutoScaling();

  async.parallel(
  [

  function(callback) {
    doEc2(callback);
  },

  function(callback) {
    doAsg(callback);
  }],

  function(err, results) {
    if (err) {
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

        console.log("Instances to stop:");
        instances.forEach(function(instance, i) {
          console.log(instance.InstanceId + ' (' + valueForKey('Name', instance.Tags) + ')');
        });
        console.log('\n');

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

        console.log("ASGs to spin down:");
        asgs.forEach(function(asg, i) {
          console.log(asg.AutoScalingGroupName + ' (' + valueForKey('Name', asg.Tags) + ')');
        });
        console.log('\n');

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