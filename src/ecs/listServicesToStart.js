const hasTag = require('../tags/hasTag');
const listTargetServices = require('./listTargetServices');
const canITouchThis = require('../tags/canITouchThis');

function startableService(service) {
  if (!service.tags) { return false; }

  service.tags.map(tag => tag.Key = tag.key);
  service.tags.map(tag => tag.Value = tag.value);
  return hasTag(service.tags, 'stop:hammertime') && canITouchThis(service.tags);
}

function listServicesToStart(currentOperatingTimezone) {
  return listTargetServices(startableService, currentOperatingTimezone);
}

module.exports = listServicesToStart;
