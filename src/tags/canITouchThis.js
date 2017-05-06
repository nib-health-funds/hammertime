const cantTouchThisBetween = require('./cantTouchThisBetween');
const cantTouchThisBefore = require('./cantTouchThisBefore');
const getHammerTimeTags = require('./getHammerTimeTags');

const tagTests = [
  cantTouchThisBetween,
  cantTouchThisBefore,
];

/**
 * Returns true if we can touch the asset described by the tags
 * @param {Array<{Key: string, Value: string}>} tags
 * @returns {Boolean}
 */
module.exports = tags => getHammerTimeTags(tags).some(tag => tagTests.reduce((accum, curr) => accum || curr(tag)));
