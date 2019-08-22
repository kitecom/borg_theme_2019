/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module PaymentWizard
define('PaymentWizard.CreditTransaction.Collection'
,	[	'PaymentWizard.CreditTransaction.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	//@class PaymentWizard.CreditTransaction.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({
		model: Model
	});
});