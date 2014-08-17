/** @jsx React.DOM */

'use strict';

var React = require('react');
var cacheShape = require('../propTypes/cacheShape');

var ConfigPanel = require('./ConfigPanel');
var KeysPanel = require('./KeysPanel');

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

module.exports = Cache;