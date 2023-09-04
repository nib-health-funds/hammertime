const hasTag = require('../tags/hasTag');
const listTargetServices = require('./listTargetServices');
const canITouchThis = require('../tags/canITouchThis');

function stoppableService(service) {
  if (!service.tags) { return false; }
  const updatedTags = service.tags.map(
    (tag) => ({ Key: tag.key, Value: tag.value }),
  );
  return !hasTag(updatedTags, 'stop:hammertime') && canITouchThis(updatedTags);
}

function listServicesToStop(currentOperatingTimezone) {
  return listTargetServices(stoppableService, currentOperatingTimezone);
}

module.exports = listServicesToStop;
