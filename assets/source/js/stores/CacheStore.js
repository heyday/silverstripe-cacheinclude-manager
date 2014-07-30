var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var update = require('react/lib/update');
var ManagerDispatcher = require('../ManagerDispatcher');
var ManagerConstants = require('../constants/ManagerConstants');

/**
 * Caches private storage
 * @type {Array}
 * @private
 */
var _caches = [];

var CHANGE_EVENT = 'change';

var CacheStore = merge(EventEmitter.prototype, {
	/**
	 * 
	 * @param caches
	 */
	init: function (caches) {
		_caches = caches;
	},

	/**
	 * 
	 */
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	
	getAll: function() {
		return _caches;
	},
	
	addByName: function (name, keys) {
		_caches = _caches.map(function (cache) {
			if (name === cache.name) {
				return update(cache, {
					keys: {$set: keys}
				});
			}

			return cache;
		});
	},

	/**
	 * 
	 * @param name
	 */
	deleteByName: function (name) {
		_caches = _caches.map(function (cache) {
			if (name === cache.name) {
				return update(cache, {
					keys: {$set: []}
				});
			}
			
			return cache;
		});
	},
	
	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}
});

ManagerDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.type) {
		case ManagerConstants.ActionTypes.RECEIVE_CACHES:
			CacheStore.init(action.caches);
			CacheStore.emitChange();
			break;
		case ManagerConstants.ActionTypes.DELETE_CACHE:
			CacheStore.deleteByName(action.cache.name);
			CacheStore.emitChange();
			break;

		case ManagerConstants.ActionTypes.RECEIVE_DELETE_CACHE_FAILED:
			CacheStore.addByName(action.cache.name, action.cache.keys);
			CacheStore.emitChange();
			break;
		default:
		// do nothing
	}
});

module.exports = CacheStore;