var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');

module.exports = {
	receiveAllCaches: function(caches) {
		ManagerDispatcher.handleServerAction({
			type: ManagerConstants.ActionTypes.RECEIVE_CACHES,
			caches: caches
		});
	}
};