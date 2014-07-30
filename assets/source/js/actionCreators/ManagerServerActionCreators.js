var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');
var request = require('superagent');

var ActionCreators = {
	receiveCaches: function(caches) {
		ManagerDispatcher.handleServerAction({
			type: ManagerConstants.ActionTypes.RECEIVE_CACHES,
			caches: caches
		});
	}
};

module.exports = ActionCreators;