var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');

module.exports = {
	deleteCache: function(name) {
		ManagerDispatcher.handleViewAction({
			type: ManagerConstants.ActionTypes.DELETE_CACHE,
			name: name
		});
	}
};