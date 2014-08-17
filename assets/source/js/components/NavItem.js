/** @jsx React.DOM */

'use strict';

var React = require('react');
var cx = require('react/lib/cx');

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

module.exports = NavItem;