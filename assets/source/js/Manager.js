/** @jsx React.DOM */

'use strict';

var React = require('react');
var ManagerServerActionCreators = require('./actionCreators/ManagerServerActionCreators');
var ManagerCacheActionCreators = require('./actionCreators/ManagerCacheActionCreators');
var CacheStore = require('./stores/CacheStore');
var ServerUpdatesAPI = require('./utils/ServerUpdatesAPI');

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
			keys: React.PropTypes.arrayOf(React.PropTypes.string),
			config: React.PropTypes.object
		})
	},
	
	getInitialState: function () {
		return {
			viewKeys: false,
			viewConfig: false
		};
	},

	render: function () {
		return (
			<tbody>
				<tr>
					<td>{this.props.cache.name}</td>
					<td><span className="badge">{this.props.cache.keys.length}</span></td>
					<td>{this.renderDeleteButton()}</td>
					<td>{this.renderViewConfigButton()}</td>
					<td>{this.renderViewKeysButton()}</td>
				</tr>
				{this.state.viewConfig && this.renderConfig()}
				{this.state.viewKeys && this.renderKeys()}
			</tbody>
		);
	},

	renderDeleteButton: function () {
		return <button onClick={this.handleDelete} disabled={!this.props.cache.keys.length} className="btn btn-danger btn-sm">Delete keys</button>;
	},

	renderViewConfigButton: function () {
		return <button onClick={this.handleToggleViewConfig} className="btn btn-info btn-sm">{this.state.viewConfig ? 'Hide' : 'Show'} config</button>;
	},

	renderViewKeysButton: function () {
		return <button onClick={this.handleToggleViewKeys} disabled={!this.props.cache.keys.length} className="btn btn-info btn-sm">{this.state.viewKeys ? 'Hide' : 'Show'} keys</button>;
	},
	
	renderConfig: function () {
		var config = {};
		
		for (var i in this.props.cache.config) {
			config[i] = (
				<tr>
					<td>{i}</td>
					<td>{this.props.cache.config[i]}</td>
				</tr>
			);
		}
		
		return (
			<tr>
				<td colSpan="5">
					<div className="panel panel-default">
						<table className="table table-striped">
							<tbody>{config}</tbody>
						</table>
					</div>
				</td>
			</tr>
		);
	},

	renderKeys: function () {
		var keys = this.props.cache.keys.map(function (key, i) {
			return (
				<li key={i}>{key}</li>
				);
		});
		
		return (
			<tr>
				<td colSpan="5">
					<ul>{keys}</ul>
				</td>
			</tr>
		);
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCache(this.props.cache);
	},

	handleToggleViewConfig: function () {
		this.setState({viewConfig: !this.state.viewConfig});
	},

	handleToggleViewKeys: function () {
		this.setState({viewKeys: !this.state.viewKeys});
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
			ManagerServerActionCreators.receiveCaches(this.props.initialCaches);
		}

		ServerUpdatesAPI.setupLongPolling();
	},

	componentWillUnmount: function () {
		CacheStore.removeChangeListener(this._onChange);
		ServerUpdatesAPI.removeLongPolling();
	},

	render: function () {
		var caches = this.state.caches.map(function (cache, i) {
			return <Cache key={i} cache={cache} />;
		});

		return (
			<div>
				<button onClick={this.handleDelete} className="btn btn-danger">Delete all</button>
				<table className="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Keys</th>
							<th>Delete</th>
							<th>Config</th>
							<th>Keys</th>
						</tr>
					</thead>
					{caches}
				</table>
			</div>
		);
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCaches(this.state.caches);
	},

	/**
	 * Event handler for 'change' events coming from the MessageStore
	 */
	_onChange: function() {
		this.setState(getStateFromStores());
	}
});

module.exports = Manager;