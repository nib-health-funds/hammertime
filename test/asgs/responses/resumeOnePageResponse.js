const resumeOnePageResponse = {
  AutoScalingGroups: [
    {
      AutoScalingGroupName: 'cant-touch-this-asg-page-2',
      MinSize: 0,
      MaxSize: 0,
      DesiredCapacity: 0,
      Tags: [
        {
          Key: 'hammertime:canttouchthis',
          Value: '',
        },
        {
          Key: 'hammertime:asgsuspend',
          Value: '',
        },
        {
          Key: 'stop:hammertime',
          Value: '',
        },
      ],
    },
    {
      AutoScalingGroupName: 'can-touch-this-asg-page-2',
      MinSize: 0,
      MaxSize: 0,
      DesiredCapacity: 0,
      Tags: [
        {
          Key: 'stop:hammertime',
          Value: '',
        },
        {
          Key: 'hammertime:asgsuspend',
          Value: '',
        },
      ],
    },
    {
      AutoScalingGroupName: 'untouched-asg-page-2',
      MinSize: 1,
      MaxSize: 3,
      DesiredCapacity: 2,
      Tags: [],
    },
  ],
  NextToken: '',
};

module.exports = resumeOnePageResponse;
