/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CreditCard
define('PaymentInstrument.CreditCard.View'
,	[
		'SC.Configuration'
	,	'CreditCard.Edit.Form.SecurityCode.View'
	,	'paymentinstrument_creditcard.tpl'
	,	'Backbone.CompositeView'
	,	'Backbone.FormView'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	CreditCardEditFormSecurityCodeView
	,	paymentinstrument_creditcard_tpl
	,	BackboneCompositeView
	,	BackboneFormView
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class CreditCard.View @extends Backbone.View
	return Backbone.View.extend({

		template: paymentinstrument_creditcard_tpl

	,	initialize: function (options)
		{
			BackboneCompositeView.add(this);
			this.options = options;

			if (this.options.showSecurityCodeForm)
			{
				this.model.set('hasSecurityCode', true);

				this.bindings = {
					'[name="ccsecuritycode"]': 'ccsecuritycode'
				};

				this.events = {
					'submit form': 'doNothing'
				};

				BackboneFormView.add(this);
			}
		}

	, 	childViews : {
			'CreditCard.Edit.Form.SecurityCode' : function ()
			{
				return new CreditCardEditFormSecurityCodeView(
				{
					error: this.options.securityNumberError
				,	showCreditCardHelp: this.options.showCreditCardHelp
				,	creditCardHelpTitle: this.options.creditCardHelpTitle
				});
			}
		}

	,	doNothing: function (e)
		{
			e.preventDefault();
		}

		//@method getContext @return CreditCard.View
	,	getContext: function ()
		{
			var payment_methods = Configuration.get('siteSettings.paymentmethods')
			,	payment_method_model = this.model.get('paymentmethod')
			,	payment_method_selected = _.findWhere(payment_methods, {internalid: typeof payment_method_model === 'object' ? payment_method_model.internalid : payment_method_model})
			,	icon = payment_method_selected && payment_method_selected.imagesrc && payment_method_selected.imagesrc[0]
			,	isSelected = this.options.hideSelector || (this.model.get('internalid') === this.options.selectedCreditCardId);

			//@class CreditCard.View
			return {
				//@property {String} creditCartId
				creditCartId: this.model.get('internalid')
				//@property {Boolean} showSecurityCodeForm
			,	showSecurityCodeForm: !!this.options.showSecurityCodeForm && isSelected
				// @property {String} showCreditCardImage
			,	showCreditCardImage: !!icon
				// @property {String} paymentMethodImageUrl
			,	paymentMethodImageUrl: icon || ''
				//@property {String} paymentName
			,	paymentName: payment_method_selected ? payment_method_selected.name : ''
				//@property {String} lastfourdigits
			,	lastfourdigits: this.model.get('cardlastfourdigits') || (this.model.get('ccnumber') && this.model.get('ccnumber').substring(this.model.get('ccnumber').length - 4))
				//@property {String} ccname
			,	ccname: this.model.get('ccname') || ''
				//@property {String} expirationDate
			,	expirationDate: this.model.get('cardexpirationdate') || this.model.get('expirationdate')
				//@property {Boolean} showDefaults
			,	showDefaults: !!this.options.showDefaults
				//@property {Boolean} isDefaultCreditCard
			,	isDefaultCreditCard: this.model.get('ccdefault') === 'T'
				//@property {Boolean} showSelect
			,	showSelect: !!this.options.showSelect
				//@property {String} selectMessage
			,	selectMessage: this.options.selectMessage
				//@property {Boolean} showActions
			,	showActions: !!this.options.showActions
				//@property {Boolean} isSelected
			, 	isSelected: isSelected
				//@property {Boolean} showSelector
			, 	showSelector: !this.options.hideSelector
				//@property {Boolean} isNewPaymentMethod
			, 	isNewPaymentMethod: this.model.get('internalid') < 0
			};
		}
	});
});