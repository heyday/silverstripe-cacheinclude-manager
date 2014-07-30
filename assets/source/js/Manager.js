/** @jsx React.DOM */

'use strict';

var React = require('react');
var ManagerServerActionCreators = require('./actionCreators/ManagerServerActionCreators');
var ManagerCacheActionCreators = require('./actionCreators/ManagerCacheActionCreators');
var CacheStore = require('./stores/CacheStore');

/**
 * 
 * @returns {{caches: (*|Object)}}
 */
function getStateFromStores() {
	return {
		caches: CacheStore.getAll()
	};
}

var Cache = React.createClass({
	propTypes: {
		cache: React.PropTypes.shape({
			name: React.PropTypes.string,
			keys: React.PropTypes.arrayOf(React.PropTypes.string)
		})
	},

	render: function () {
		var caches = this.props.cache.keys.map(function (key) {
			return (
				<li>{key}</li>
			);
		});
		
		return (
			<div>
				<h1>{this.props.cache.name} <button onClick={this.handleDelete} className="btn btn-danger">Delete cached items</button></h1>
				<ul>
					{caches}
				</ul>
			</div>
		);
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCache(this.props.cache);
	}
});

var Manager = React.createClass({
	propTypes: {
		initialCaches: React.PropTypes.arrayOf(React.PropTypes.object)
	},
	
	getInitialState: function () {
		return getStateFromStores();
	},
	
	componentDidMount: function () {
		CacheStore.addChangeListener(this._onChange);

		if (this.props.initialCaches) {
			ManagerServerActionCreators.receiveAllCaches(this.props.initialCaches);
		}
	},

	render: function () {
		var caches = this.state.caches.map(function (cache, i) {
			return <Cache key={i} cache={cache} />;
		});

		return (
			<div>
				{caches}
			</div>
		);
	},

	/**
	 * Event handler for 'change' events coming from the MessageStore
	 */
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Manager;