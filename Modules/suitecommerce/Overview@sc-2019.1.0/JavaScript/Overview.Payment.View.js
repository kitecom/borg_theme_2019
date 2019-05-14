/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Overview.Payment.View.js
// -----------------------

define('Overview.Payment.View'
,	[
		'SC.Configuration'
	,	'PaymentMethod.Helper'

	,	'overview_payment.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Utils'
	]
,	function(
		Configuration
	,	PaymentMethodHelper

	,	overview_payment_tpl

	,	Backbone
	,	BackboneCompositeView
	)
{
	'use strict';

	// home page view
	return Backbone.View.extend({

		template: overview_payment_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'CreditCard.View': function()
			{
				var view = PaymentMethodHelper.getCreditCardView();
				return new view({
					model: this.model
				,	hideSelector: true
				});
			}
		}

		//@method getContext @returns {Overview.Payment.View.Context}
	,	getContext: function()
		{
			//@class Overview.Payment.View.Context
			return {
				//@property {Boolean} hasDefaultCreditCard
				hasDefaultCreditCard: !!this.model
				//@property {String} creditCardInternalid
			,	creditCardInternalid: this.model && this.model.get('internalid')
			};
		}
	});
});