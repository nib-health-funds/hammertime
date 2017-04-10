const stopOnePageResponse = require('./stopOnePageResponse');
const stopTwoPageResponse = require('./stopTwoPageResponse');

module.exports = function paginatedStop(nextToken) {
  return nextToken ? stopOnePageResponse : stopTwoPageResponse;
};
