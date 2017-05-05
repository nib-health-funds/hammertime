module.exports = function hasTag(asg, target) {
  return asg.Tags.some(tag => tag.Key === target);
};
