/** @jsx React.DOM */

'use strict';

var React = require('react');
var ManagerCacheActionCreators = require('../actionCreators/ManagerCacheActionCreators');
var cacheShape = require('../propTypes/cacheShape');

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

module.exports = KeysPanel;