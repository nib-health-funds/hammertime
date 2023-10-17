const assert = require("assert");
const { mockClient } = require('aws-sdk-client-mock');
const listServicesToStop = require("../../src/ecs/listServicesToStop.js");
const defaultOperatingTimezone = require("../../src/config.js").defaultOperatingTimezone;
const data = require("./mockData");
const { ECSClient, DescribeServicesCommand, ListServicesCommand, DescribeClustersCommand, ListClustersCommand } = require("@aws-sdk/client-ecs");

const ecsMock = mockClient(ECSClient);

describe("listServicesToStop()", () => {
  beforeEach(() => {
    ecsMock.reset();
  });

  it("returns list of services spun down by hammertime", async () => {
    ecsMock
      .on(DescribeServicesCommand)
      .callsFake((params) => data.describeServices(params));
    
    ecsMock
      .on(DescribeClustersCommand)
      .callsFake((params) => data.describeClusters(params));
    
    ecsMock
      .on(ListClustersCommand)
      .callsFake((params) => data.listClusters(params));
 
    ecsMock
      .on(ListServicesCommand)
      .callsFake((params) => data.listServices(params));
  
    const hammertimeableServices = await listServicesToStop(defaultOperatingTimezone);
    const valid = [
      "arn:aws:ecs:service:1-R-unhammertimed",
      "arn:aws:ecs:service:2-R-unhammertimed"
    ];
    assert.equal(hammertimeableServices.length, 2);
    assert.equal(
      hammertimeableServices.filter(service => valid.some(validService => validService === service.serviceArn)
      ).length,
      2
    );
  });
});
