var request = require('superagent');
var ManagerServerActionCreators = require('../actionCreators/ManagerServerActionCreators');

var POLLING_RATE = 2000;
var timeout = false;

/**
 * Set up long polling
 */
function setupLongPolling() {
	if (timeout) {
		return;
	}
	
	timeout = setTimeout(function () {
		request.get('/cache-manager/cache/').end(function (res) {
			if (!res.error) {
				ManagerServerActionCreators.receiveCaches(res.body.data);
			}
			timeout = false;
			setupLongPolling();
		});
	}, POLLING_RATE);
}

/**
 * Remove the long polling
 */
function removeLongPolling(){
	if (timeout) {
		clearTimeout(timeout);
		timeout = false;
	}
}

module.exports = {
	setupLongPolling: setupLongPolling,
	removeLongPolling: removeLongPolling
};