const stopAlreadyRunResponse = {
  AutoScalingGroups: [
    {
      DesiredCapacity: 3,
      Tags: [
        {
          Key: 'hammertime:canttouchthis',
          Value: '',
        },
      ],
      AutoScalingGroupName: 'cant-touch-this-asg',
      MinSize: 3,
      MaxSize: 3,
    },
    {
      DesiredCapacity: 3,
      Tags: [
        {
          Key: 'stop:hammertime',
          Value: '',
        },
      ],
      AutoScalingGroupName: 'already-touched-this-asg',
      MinSize: 3,
      MaxSize: 3,
    },
    {
      DesiredCapacity: 3,
      Tags: [],
      AutoScalingGroupName: 'can-touch-this-asg',
      MinSize: 3,
      MaxSize: 3,
    },
  ],
  NextToken: '',
};

module.exports = stopAlreadyRunResponse;
