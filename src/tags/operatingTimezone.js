const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals');
const getHammertimeTags = require('./getHammerTimeTags');
const defaultOperatingTimezone = require('../config').defaultOperatingTimezone;

/**
 * Returns the operating timezone
 * @param {Array<{Key: string, Value: string}>} tags
 * @returns {string}
 */
module.exports = (tags) => {
  const timezoneTags = getHammertimeTags(tags).filter(tag => caseInvariantStringEquals(tag.Key, 'hammertime:operatingTimezone'));

  if (timezoneTags.length === 0 || timezoneTags.length > 1) {
    console.log(`No timezone tag found or multiple timezone tags found. Defaulting to ${defaultOperatingTimezone}`);
    return defaultOperatingTimezone;
  }

  return timezoneTags[0].Value;
};
