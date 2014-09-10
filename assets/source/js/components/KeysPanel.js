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
				<table className="table table-striped">
					<thead>
						<tr>{this.renderTableColumns()}</tr>
					</thead>
					<tbody>{this.renderTableRows()}</tbody>
				</table>
			</div>
		);
	},

	handleDelete: function () {
		ManagerCacheActionCreators.deleteCache(this.props.cache);
	},
	
	getColumns: function () {
		var columns = [
			'key'
		];

		this.props.cache.keys.forEach(function (key) {
			if (typeof key.information !== 'object') {
				return;
			}

			Object.keys(key.information).forEach(function (infoKey) {
				if (columns.indexOf(infoKey) === -1) {
					columns.push(infoKey);
				}
			});
		});
		
		return columns;
	},

	renderTableColumns: function () {
		return this.getColumns().map(function (column) {
			return <th>{column}</th>;
		});
	},
	
	renderTableRows: function () {
		var columns = this.getColumns();
		
		return this.props.cache.keys.map(function (key, i) {
			var rowColumns = columns.map(function (column) {
				return this.renderTableRowColumn(key, column);
			}.bind(this));
			return (
				<tr key={i}>{rowColumns}</tr>
			);
		}.bind(this));
	},

	renderTableRowColumn: function (key, column) {
		var contents;
		if (column === 'key') {
			contents = key.key;
		} else if (typeof key.information !== 'object' || !key.information[column]) {
			contents = 'NA';
		} else if (column === 'url') {
			contents = <a href={key.information[column]} target="_blank">{key.information[column]}</a>;
		} else {
			contents = information[type];
		}
		
		return <td>{contents}</td>;
	}
});

module.exports = KeysPanel;