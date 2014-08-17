/** @jsx React.DOM */

'use strict';

var React = require('react');

var Nav = React.createClass({
	render: function () {
		return (
			<ul className="nav nav-pills nav-stacked">
				{this.props.children}
			</ul>
		);
	}
});

module.exports = Nav;