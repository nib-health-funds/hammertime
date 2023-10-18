const TAG_PREFIX = 'hammertime';
const HAMMERTIME_TAG_REGEX = new RegExp(`^${TAG_PREFIX}:[\\w]+$`);

/**
 * Returns all the hammertime tags.
 * @param {Array<{Key:string, Value: string}>} tags
 * @returns {Array<{Key:string, Value: string}>}
 */
module.exports = tags => tags.filter(tag => HAMMERTIME_TAG_REGEX.test(tag.Key));
