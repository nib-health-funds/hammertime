const moment = require('moment');
const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals');

const CANT_TOUCH_THIS_BETWEEN_REGEX = /^(\d{4}-\d{2}-\d{2}) and (\d{4}-\d{2}-\d{2})$/;

/**
 * Returns true when the tag is a 'cantTouchThisBetween' tag and has a value
 * specified where in that the current UTC date is between the specified dates.
 * @param {{Key:string, Value: string}} tag
 * @returns {Boolean}
 */
module.exports = (tag) => {
  if (!caseInvariantStringEquals(tag.Key, 'hammertime:cantTouchThisBetween')) {
    return false;
  }

  if (CANT_TOUCH_THIS_BETWEEN_REGEX.test(tag.Value)) {
    const matches = CANT_TOUCH_THIS_BETWEEN_REGEX.exec(tag.Value);
    return moment.utc().isBetween(moment(matches[1], 'YYYY-MM-DD'), moment(matches[2], 'YYYY-MM-DD'));
  }

  return false;
};
