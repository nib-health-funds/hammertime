module.exports = function valueForKey(tags, key) {
  return tags.find(tag => tag.Key === key).Value;
};
