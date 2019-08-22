/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Transaction
define('LiveOrder.Line.Collection'
,	[
		'Transaction.Line.Collection'
	,	'LiveOrder.Line.Model'

	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionLineCollection
	,	LiveOrderLineModel

	,	_
	)
{
	'use strict';


	return TransactionLineCollection.extend({

		model: LiveOrderLineModel

	,	url: _.getAbsoluteUrl('services/LiveOrder.Line.Service.ss')
	});
});