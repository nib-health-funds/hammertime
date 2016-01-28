console.log('Loading function');

const AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';


exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var params = {
    DryRun: false,
    Filters: [{
      Name: 'instance-state-name',
      Values: ['stopped']
    }]
  };


  ec2.describeInstances(params, function(err, data) {
    if (err) {
      console.log("Error: " + err);
      context.fail();
    } else {
      instances = [].concat.apply([], data.Reservations.map(function(reservation) {
        return reservation.Instances;
      })).filter(function(instance) {
        if (tagsContainsKey(instance.Tags, 'aws:autoscaling:groupName') || tagsContainsKey(instance.Tags, 'hammertime:off')) {
          return false;
        } else {
          return true;
        }
      });

      console.log("Instances to start:");
      instances.forEach(function(instance, i) {
        console.log(instance.InstanceId);
      });
      context.done();
    }
  });


  var tagsContainsKey = function(tags, aKey) {
    returnValue = false;

    tags.forEach(function(tag) {
      if (tag['Key'] === aKey) {
        returnValue = true;
      }
    });

    return returnValue;
  };

};