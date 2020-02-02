const stopOnePageResponse = require('./stopOnePageResponse.js');
const stopTwoPageResponse = require('./stopTwoPageResponse.js');

module.exports = function paginatedStop(nextToken) {
  return nextToken ? stopOnePageResponse : stopTwoPageResponse;
};
