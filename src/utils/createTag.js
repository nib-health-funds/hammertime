module.exports = (key, resourceId, resourceType, value) => ({
  Key: key,
  PropagateAtLaunch: false,
  ResourceId: resourceId,
  ResourceType: resourceType,
  Value: value,
});
