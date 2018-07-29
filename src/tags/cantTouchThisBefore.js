const luxon = require('luxon');
const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals');

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

  const end = luxon.DateTime.fromISO(tag.Value);

  if (end.isValid) {
    return luxon.DateTime.utc() < end;
  }

  console.log('End date was not in the correct format');

  return false;
};
