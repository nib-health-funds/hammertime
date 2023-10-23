module.exports = function hasTagValue(tags, tagKey, tagValuesTarget) {
  return tags.some(tag => tag.Key === tagKey && checkTagValuesStartWith(tag.Value, tagValuesTarget));
};
/**
 * 
 * @param {*} tagValue 
 * @param {*} tagValuesTarget 
 * @returns 
 */
function checkTagValuesStartWith(tagValue, tagValuesTarget) {
  for (const target of tagValuesTarget) {
    if (tagValue.startsWith(target)) {
      return true
    }
  }
  return false
}