/** @jsx React.DOM */

'use strict';

var React = require('react');
var ManagerServerActionCreators = require('./actionCreators/ManagerServerActionCreators');
var ManagerCacheActionCreators = require('./actionCreators/ManagerCacheActionCreators');
var CacheStore = require('./stores/CacheStore');
var ServerUpdatesAPI = require('./utils/ServerUpdatesAPI');
var cacheShape = require('./propTypes/cacheShape');

var NavItem = require('./components/NavItem');
var Nav = require('./components/Nav');
var Cache = require('./components/Cache');

var Manager = React.createClass({
	propTypes: {
		initialCaches: React.PropTypes.arrayOf(cacheShape)
	},

	getInitialState: function () {
		return {
			activeCacheIndex: 0,
			caches: CacheStore.getAll()
		};
	},

	getActiveCache: function () {
		return this.state.caches[this.state.activeCacheIndex];
	},

	componentDidMount: function () {
		CacheStore.addChangeListener(this._onChange);

		if (this.props.initialCaches) {
			ManagerServerActionCreators.receiveCaches(this.props.initialCaches);
		}

		ServerUpdatesAPI.setupLongPolling();
	},

	componentWillUnmount: function () {
		CacheStore.removeChangeListener(this._onChange);
		ServerUpdatesAPI.removeLongPolling();
	},

	render: function () {
		var navItems = this.state.caches.map(function (cache, i) {
			return <NavItem
				active={i === this.state.activeCacheIndex}
				key={i}
				count={cache.keys.length}
				onClick={this.handleSelectedCacheChange.bind(this, i)}>
				{cache.name}
			</NavItem>;
		}.bind(this));

		return (
			<div className="container">
				<div className="page-header">
					<button className="btn btn-danger pull-right" onClick={this.handleDelete} href="#">
						<span className="glyphicon glyphicon-remove"></span> Delete all keys
					</button>
					<h1>
						<span>Cache Manager</span> <small>by Heyday!</small>
					</h1>
				</div>
				<div className="row">
					<div className="col-md-4">
						<Nav>
							{navItems}
						</Nav>
					</div>
					<div className="col-md-8">
						{this.state.caches.length && <Cache cache={this.getActiveCache()} />}
					</div>
				</div>
			</div>
		);
	},

	handleSelectedCacheChange: function (index, e) {
		e.preventDefault();
		this.setState({
			activeCacheIndex: index
		});
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCaches(this.state.caches);
	},

	/**
	 * Event handler for 'change' events coming from the CacheStore
	 */
	_onChange: function() {
		this.setState({
			caches: CacheStore.getAll()
		});
	}

});

module.exports = Manager;