/** @jsx React.DOM */

'use strict';

var React = require('react');

var Cache = React.createClass({
	render: function () {
		var caches = this.props.keys.map(function (key) {
			return <li>{key}</li>;
		});
		
		return (
			<div>
				<h1>{this.props.name}</h1>
				<ul>
					{caches}
				</ul>
			</div>
		);
	}
});

var Manager = React.createClass({
	propTypes: {
		keys: React.PropTypes.object
	},
	render: function () {
		var caches = [];
		var i = 0;
		
		for (var name in this.props.keys) {
			caches.push(<Cache key={i++} name={name} keys={this.props.keys[name]} />);
		}

		return (
			<div>
				{caches}
			</div>
		);
	}
});

module.exports = Manager;