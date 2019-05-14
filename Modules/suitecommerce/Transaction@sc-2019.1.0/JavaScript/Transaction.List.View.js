/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Transaction
define('Transaction.List.View'
	, ['SC.Configuration'
		, 'Backbone'
		, 'underscore'
	]
	, function (
		Configuration
		, Backbone
		, _
	) {
		'use strict';


		return Backbone.View.extend({

			_buildColumns: function (selectedColumns, transaction) {
				function createColumn(transaction, column) {
					switch (column.id) {
						case 'origin':
							return {
								label: _(column.label).translate()
								, type: 'origin'
								, name: 'origin'
								, value: _.findWhere(Configuration.get('transactionRecordOriginMapping'), {origin: transaction.get('origin') }).name
							};
						case 'status':
							var value;
							if(!transaction.get('status')) {
								value = transaction.get('entitystatus').name;
							} else {
								value = transaction.get('status').name;
							}
							return {
								label: _(column.label).translate()
								,	type: 'status'
								, name: 'status'
								, value: value
							};	
						case 'amount':
							return {
								label: _(column.label).translate()
								, type: 'currency'
								, name: 'amount'
								, value: transaction.get('amount_formatted')
							}
						default:
							var init = {
								label: _(column.label).translate()
								, value: transaction.get(column.id)
							};

							if (column.type) {
								init.type = column.type;
							}
							else {
								init.type = 'custom';
							}

							if (column.name) {
								init.name = column.name;
							}
							else {
								init.name = column.id;
							}
							return init;
					}
				}
				var initializedColumns = [];

				_.each(selectedColumns, function (column) {					
					if (!column.composite) {
						initializedColumns.push(createColumn(transaction, column));
					} else {
						var composite = require(column.composite);
						var model;
					
						if(column.fields) {
							var modelFields = {};
							_.each(column.fields, function (field) {								
								var transactionField = transaction.get(field.toLowerCase()) || transaction.get(field); // Some attributes can be returned from the services in camelcase format
								modelFields[field] = transactionField;								
							});
							model = new Backbone.Model(modelFields);
						} else {
							model = transaction;
						}

						var initialized = {
							label: _(column.label)
							, type: column.type
							, name: column.id
							, compositeKey: column.compositeKey
							, composite: new composite({model: model})
						};

						initializedColumns.push(initialized);
					}
				});

				return initializedColumns;
			}
		});
	});