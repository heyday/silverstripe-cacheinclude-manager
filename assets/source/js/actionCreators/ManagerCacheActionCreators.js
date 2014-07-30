var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');
var request = require('superagent');

module.exports = {
	deleteCache: function(cache) {
		ManagerDispatcher.handleViewAction({
			type: ManagerConstants.ActionTypes.DELETE_CACHE,
			cache: cache
		});

		request.del('/cache-manager/cache/' + cache.name).end(function(res){
			if (res.error) {
				ManagerDispatcher.handleServerAction({
					type: ManagerConstants.ActionTypes.RECEIVE_DELETE_CACHE_FAILED,
					cache: cache
				});
			}
		});
	}
};