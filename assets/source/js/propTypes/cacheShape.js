'use strict';

var React = require('react');

var keyShape = React.PropTypes.shape({
	key: React.PropTypes.string,
	information: React.PropTypes.oneOfType([
		React.PropTypes.bool,
		React.PropTypes.object
	])
});

var cacheShape = React.PropTypes.shape({
	name: React.PropTypes.string,
	keys: React.PropTypes.arrayOf(keyShape),
	config: React.PropTypes.object
});

module.exports = cacheShape;