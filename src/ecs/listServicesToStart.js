const hasTag = require("../tags/hasTag.js");
const listTargetServices = require("./listTargetServices.js");
const canITouchThis = require("../tags/canITouchThis.js");

function startableService(service) {
  if (!service.tags)
    return false;

  service.tags.map((tag) => tag.Key = tag.key);
  return hasTag(service.tags, "stop:hammertime") && canITouchThis(service.tags);
}

function listServicesToStart(currentOperatingTimezone) {
  return listTargetServices(startableService, currentOperatingTimezone);
}

module.exports = listServicesToStart;
