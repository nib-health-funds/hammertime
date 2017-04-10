module.exports = (key, resourceId, resourceType, value) => {
  return {
    Key: key,
    PropagateAtLaunch: false,
    ResourceId: resourceId,
    ResourceType: resourceType,
    Value: value,
  };
};
