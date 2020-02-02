const caseInvariantStringEquals = require('../utils/caseInvariantStringEquals.js');

/**
 * Returns true when tag is a cantTouchThis tag
 * @param {{Key: string]}} tag
 */
module.exports = tag => caseInvariantStringEquals(tag.Key, 'hammertime:cantTouchThis');
