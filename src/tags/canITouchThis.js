const cantTouchThisBetween = require('./cantTouchThisBetween');
const cantTouchThisBefore = require('./cantTouchThisBefore');

const tagTests = [
  cantTouchThisBetween,
  cantTouchThisBefore,
];

/**
 * Returns true if we can touch the asset described by the tags
 * @param {Array<{Key: string, Value: string}>} tags
 * @returns {Boolean}
 */
module.exports = tags => tags.some(tag => tagTests.reduce((accum, curr) => accum || curr(tag)));
