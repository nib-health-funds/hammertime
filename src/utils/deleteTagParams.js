module.exports = (key, resourceId, resourceType) => {
  return {
    Key: key,
    PropagateAtLaunch: false,
    ResourceId: resourceId,
    ResourceType: resourceType,
  };
};
