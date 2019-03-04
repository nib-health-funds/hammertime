const luxon = require('luxon');
const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals');

const CANT_TOUCH_THIS_BETWEEN_REGEX = /^(.*) and (.*)$/;

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
    const now = luxon.DateTime.utc();
    const start = luxon.DateTime.fromISO(matches[1]);
    const end = luxon.DateTime.fromISO(matches[2]);

    if (!start.isValid) {
      console.log('Start date was not in the correct format');
      return false;
    }

    if (!end.isValid) {
      console.log('End date was not in the correct format');
      return false;
    }

    return now <= end && now >= start;
  }

  return false;
};
