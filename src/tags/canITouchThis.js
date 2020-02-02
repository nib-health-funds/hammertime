const cantTouchThisBetween = require('./cantTouchThisBetween.js');
const cantTouchThisBefore = require('./cantTouchThisBefore.js');
const cantTouchThis = require('./cantTouchThis.js');
const getHammerTimeTags = require('./getHammerTimeTags.js');

const tagTests = [
  cantTouchThisBetween,
  cantTouchThisBefore,
  cantTouchThis,
];

/**
 * Returns true if we can touch the asset described by the tags
 * @param {Array<{Key: string, Value: string}>} tags
 * @returns {Boolean}
 */
// eslint-disable-next-line max-len
module.exports = tags => getHammerTimeTags(tags).every(tag => tagTests.reduce((prev, curr) => prev && !curr(tag), true));
