const assert = require("assert");
const { mockClient } = require('aws-sdk-client-mock');
const listServicesToStart = require("../../src/ecs/listServicesToStart");
const defaultOperatingTimezone = require("../../src/config").defaultOperatingTimezone;
const data = require("./mockData");
const { ECSClient, DescribeServicesCommand, ListServicesCommand, DescribeClustersCommand, ListClustersCommand } = require("@aws-sdk/client-ecs")

const ecsMock = mockClient(ECSClient);

describe("listServicesToStart()", () => {
  beforeEach(() => {
    ecsMock.reset();
  });

  it("returns list of services spun up by hammertime", async () => {
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

    const hammertimedServices = await listServicesToStart(defaultOperatingTimezone);
    assert.equal(hammertimedServices.length, 1);
    assert.equal(
      hammertimedServices[0].serviceArn,
      "arn:aws:ecs:service:3-R-hammertimed"
    );
  });
});
