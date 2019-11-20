const resumeOnePageResponse = require('./resumeOnePageResponse');
const resumeTwoPageResponse = require('./resumeTwoPageResponse');

module.exports = function paginatedResume(nextToken) {
  return nextToken ? resumeOnePageResponse : resumeTwoPageResponse;
};
