const startOnePageResponse = require('./startOnePageResponse');
const startTwoPageResponse = require('./startTwoPageResponse');

module.exports = function paginatedStart(nextToken) {
  return nextToken ? startOnePageResponse : startTwoPageResponse;
};
