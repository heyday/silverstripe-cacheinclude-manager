var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');

module.exports = {
	receiveAllCaches: function(caches) {
		ManagerDispatcher.handleServerAction({
			type: ManagerConstants.ActionTypes.RECEIVE_CACHES,
			caches: caches
		});
	},
	receiveDeleteFailed: function (name, rollback, response) {
		ManagerDispatcher.handleServerAction({
			type: ManagerConstants.ActionTypes.RECEIVE_DELETE_CACHE_FAILED,
			name: name,
			rollback: rollback,
			response: response
		});
	}
};