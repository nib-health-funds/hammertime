module.exports = {
  listClusters: params => {
    return {
      clusterArns: [
        "arn:aws:ecs:cluster/1",
        "arn:aws:ecs:cluster/2",
        "arn:aws:ecs:cluster/3"
      ]
    }
  },
  listServices: params => {
    switch (params.cluster) {
      case "arn:aws:ecs:cluster/1":
        return {
          serviceArns: ["arn:aws:ecs:service:1-R", "arn:aws:ecs:service:2-R"]
        };
      case "arn:aws:ecs:cluster/2":
        return {
          serviceArns: ["arn:aws:ecs:service:3-R"]
        };
      default:
        return {
          serviceArns: []
        };
    }
  },
  describeClusters: params => {
    return {
      clusters: [
        { clusterArn: "arn:aws:ecs:cluster/1" },
        { clusterArn: "arn:aws:ecs:cluster/2" },
        { clusterArn: "arn:aws:ecs:cluster/3" }
      ]
    };
  },
  describeServices: params => {
    switch (params.cluster) {
      case "arn:aws:ecs:cluster/1":
        return {
          services: [
            {
              serviceArn: "arn:aws:ecs:service:1-R-unhammertimed",
              clusterArn: "arn:aws:ecs:cluster/1",
              desiredCount: 2,
              runningCount: 2,
              launchType: "FARGATE",
              tags: [{ key: "key!", value: "value!" }]
            },
            {
              serviceArn: "arn:aws:ecs:service:2-R-unhammertimed",
              clusterArn: "arn:aws:ecs:cluster/1",
              desiredCount: 2,
              runningCount: 2,
              launchType: "FARGATE",
              tags: [{ key: "key!", value: "value!" }]
            }
          ]
        };
      case "arn:aws:ecs:cluster/2":
        return {
          services: [
            {
              serviceArn: "arn:aws:ecs:service:3-R-hammertimed",
              clusterArn: "arn:aws:ecs:cluster/1",
              desiredCount: 0,
              runningCount: 0,
              launchType: "FARGATE",
              tags: [
                {
                  key: "stop:hammertime",
                  value: "date"
                },
                {
                  key: "hammertime:originalServiceSize",
                  value: "2"
                }
              ]
            }
          ]
        };
      default:
        return {
          services: []
        };
    }
  }
};
