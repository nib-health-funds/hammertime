const luxon = require('luxon');
const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals');

const CANT_TOUCH_THIS_BEFORE_REGEX = /^(\d{4}-\d{2}-\d{2})$/;

/**
 * Returns true when the tag is a 'cantTouchThisBefore' tag and has a value
 * specified where in that the current UTC date is between the specified dates.
 * @param {{Key:string, Value: string}} tag
 * @returns {Boolean}
 */
module.exports = (tag) => {
  if (!caseInvariantStringEquals(tag.Key, 'hammertime:cantTouchThisBefore')) {
    return false;
  }

  if (CANT_TOUCH_THIS_BEFORE_REGEX.test(tag.Value)) {
    const matches = CANT_TOUCH_THIS_BEFORE_REGEX.exec(tag.Value);
    return luxon.DateTime.local() < luxon.DateTime.fromISO(matches[1]);
  }

  return false;
};
