const assert = require("assert");
const AWS = require("aws-sdk-mock");
const listServicesToStop = require("../../src/ecs/listServicesToStop.js");
const defaultOperatingTimezone = require("../../src/config.js").defaultOperatingTimezone;
const data = require("./mockData.js");

describe("listServicesToStop()", () => {
  beforeEach(() => {
    AWS.mock("ECS", "describeServices", (params, callback) =>
      callback(null, data.describeServices(params))
    );
    AWS.mock("ECS", "describeClusters", (params, callback) =>
      callback(null, data.describeClusters(params))
    );
    AWS.mock("ECS", "listClusters", (params, callback) =>
      callback(null, data.listClusters(params))
    );
    AWS.mock("ECS", "listServices", (params, callback) =>
      callback(null, data.listServices(params))
    );
  });

  it("returns list of services spun down by hammertime", () => {
    return listServicesToStop(defaultOperatingTimezone).then(
      hammertimeableServices => {
        const valid = [
          "arn:aws:ecs:service:1-R-unhammertimed",
          "arn:aws:ecs:service:2-R-unhammertimed"
        ];
        assert.equal(hammertimeableServices.length, 2);
        assert.equal(
          hammertimeableServices.filter(service =>
            valid.some(validService => validService === service.serviceArn)
          ).length,
          2
        );
      }
    );
  });

  afterEach(() => {
    AWS.restore("ECS", "describeServices");
    AWS.restore("ECS", "describeClusters");
    AWS.restore("ECS", "listClusters");
    AWS.restore("ECS", "listServices");
  });
});
