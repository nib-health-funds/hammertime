const hasTag = require('../tags/hasTag');
const listTargetServices = require('./listTargetServices');
const canITouchThis = require('../tags/canITouchThis');

function stoppableService(service) {
  if (!service.tags) { return false; }

  service.tags.map(tag => tag.Key = tag.key);
  return !hasTag(service.tags, 'stop:hammertime') && canITouchThis(service.tags);
}

function listServicesToStop(currentOperatingTimezone) {
  return listTargetServices(stoppableService, currentOperatingTimezone);
}

module.exports = listServicesToStop;
