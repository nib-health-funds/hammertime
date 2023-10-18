module.exports = function hasTag(tags, target) {
  return tags.some(tag => tag.Key === target);
};
