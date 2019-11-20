const suspendOnePageResponse = require('./suspendOnePageResponse');
const suspendTwoPageResponse = require('./suspendTwoPageResponse');

module.exports = function paginatedsuspend(nextToken) {
  return nextToken ? suspendOnePageResponse : suspendTwoPageResponse;
};
