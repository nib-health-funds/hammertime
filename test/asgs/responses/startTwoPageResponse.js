const startTwoPageResponse = {
  AutoScalingGroups: [
    {
      AutoScalingGroupName: 'cant-touch-this-asg-page-1',
      MinSize: 0,
      MaxSize: 0,
      DesiredCapacity: 0,
      Tags: [
        {
          Key: 'hammertime:canttouchthis',
          Value: '',
        },
        {
          Key: 'stop:hammertime',
          Value: '',
        },
        {
          Key: 'hammertime:originalASGSize',
          Value: '1,1,1',
        },
      ],
    },
    {
      AutoScalingGroupName: 'can-touch-this-asg-page-1',
      MinSize: 0,
      MaxSize: 0,
      DesiredCapacity: 0,
      Tags: [
        {
          Key: 'stop:hammertime',
          Value: '',
        },
        {
          Key: 'hammertime:originalASGSize',
          Value: '1,1,1',
        },
      ],
    },
    {
      AutoScalingGroupName: 'untouched-asg-page-1',
      MinSize: 1,
      MaxSize: 3,
      DesiredCapacity: 2,
      Tags: [],
    },
  ],
  NextToken: 'foobar',
};

module.exports = startTwoPageResponse;
