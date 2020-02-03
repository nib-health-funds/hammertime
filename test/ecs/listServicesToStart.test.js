const assert = require("assert");
const AWS = require("aws-sdk-mock");
const listServicesToStart = require("../../src/ecs/listServicesToStart");
const defaultOperatingTimezone = require("../../src/config").defaultOperatingTimezone;
const data = require("./mockData");

describe("listServicesToStart()", () => {
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

  it("returns list of services spun up by hammertime", () => {
    return listServicesToStart(defaultOperatingTimezone).then(
      hammertimedServices => {
        assert.equal(hammertimedServices.length, 1);
        assert.equal(
          hammertimedServices[0].serviceArn,
          "arn:aws:ecs:service:3-R-hammertimed"
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
