/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;
var ManagerServerActionCreators = require('./actionCreators/ManagerServerActionCreators');
var ManagerCacheActionCreators = require('./actionCreators/ManagerCacheActionCreators');
var CacheStore = require('./stores/CacheStore');
var ServerUpdatesAPI = require('./utils/ServerUpdatesAPI');

var cacheShape = React.PropTypes.shape({
	name: React.PropTypes.string,
	keys: React.PropTypes.arrayOf(React.PropTypes.string),
	config: React.PropTypes.object
});

/**
 * 
 */
function getCachesFromStore() {
	return CacheStore.getAll();
}

var Nav = React.createClass({
	render: function () {
		return (
			<ul className="nav nav-pills nav-stacked">
				{this.props.children}
			</ul>
		);
	}
});

var NavItem =  React.createClass({
	render: function () {
		var classes = cx({
			"active": this.props.active
		});
		return (
			<li className={classes}>
				<a onClick={this.props.onClick} href="#">
					<span className="badge pull-right">{this.props.count}</span> {this.props.children}
				</a>
			</li>
		);
	}
});

var ConfigPanel = React.createClass({
	propTypes: {
		cache: cacheShape
	},

	render: function () {
		var config = {};

		for (var i in this.props.cache.config) {
			if (this.props.cache.config.hasOwnProperty(i)) {
				config[i] = (
					<tr>
						<td>{i}</td>
						<td>{this.props.cache.config[i]}</td>
					</tr>
				);
			}
		}

		return (
			<div className="panel panel-primary">
				<div className="panel-heading">
					<h3 className="panel-title">Config</h3>
				</div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Key</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>{config}</tbody>
				</table>
			</div>
		);
	}
});

var KeysPanel = React.createClass({
	propTypes: {
		cache: cacheShape
	},

	render: function () {
		var keys = this.props.cache.keys.map(function (key, i) {
			return (
				<li className="list-group-item" key={i}>{key}</li>
			);
		});
		
		return (
			<div className="panel panel-primary">
				<div className="panel-heading clearfix">
					<div className="btn-group pull-right">
						<button
							onClick={this.handleDelete}
							disabled={!this.props.cache.keys.length}
							className="btn btn-sm btn-danger"><span className="glyphicon glyphicon-remove"></span> Delete keys</button>
					</div>
					<h3 className="panel-title">Keys</h3>
				</div>
				<ul className="list-group">
					{keys}
				</ul>
			</div>
		);
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCache(this.props.cache);
	}
});

var Cache = React.createClass({
	propTypes: {
		cache: cacheShape
	},

	render: function () {
		return (
			<div>
				<ConfigPanel cache={this.props.cache} />
				<KeysPanel cache={this.props.cache} />
			</div>
		);
	}
});

var Manager = React.createClass({
	propTypes: {
		initialCaches: React.PropTypes.arrayOf(cacheShape)
	},

	getInitialState: function () {
		return {
			activeCacheIndex: 0,
			caches: getCachesFromStore()
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
			caches: getCachesFromStore()
		});
	}
	
});

module.exports = Manager;