/** @jsx React.DOM */

'use strict';

var React = require('react');
var cacheShape = require('../propTypes/cacheShape');

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

module.exports = ConfigPanel;