'use strict';

var React = require('react');

var cacheShape = React.PropTypes.shape({
	name: React.PropTypes.string,
	keys: React.PropTypes.arrayOf(React.PropTypes.string),
	config: React.PropTypes.object
});

module.exports = cacheShape;