const stopTwoPageResponse = {
  AutoScalingGroups: [
    {
      DesiredCapacity: 3,
      Tags: [
        {
          Key: 'hammertime:canttouchthis',
          Value: '',
        },
      ],
      AutoScalingGroupName: 'cant-touch-this-asg-page-1',
      MinSize: 3,
      MaxSize: 3,
    },
    {
      DesiredCapacity: 3,
      Tags: [],
      AutoScalingGroupName: 'can-touch-this-asg-page-1',
      MinSize: 3,
      MaxSize: 3,
    },
  ],
  NextToken: 'foobar',
};

module.exports = stopTwoPageResponse;
