const startOnePageResponse = require('./startOnePageResponse.js');
const startTwoPageResponse = require('./startTwoPageResponse.js');

module.exports = function paginatedStart(nextToken) {
  return nextToken ? startOnePageResponse : startTwoPageResponse;
};
