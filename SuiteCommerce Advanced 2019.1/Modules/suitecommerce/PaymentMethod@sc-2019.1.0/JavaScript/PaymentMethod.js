/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module PaymentMethod
// Defines the PaymentMethod module
define('PaymentMethod'
,	[
		'PaymentInstrument.CreditCard.Edit.View'
	,	'PaymentMethod.CreditCard.List.View'
	,	'underscore'
	,	'Utils'
	]
,	function (
		CreditCardEditView
	,	PaymentMethodCreditCardListView
	,	_
	,	Utils
	)
{
	'use strict';

	// @class PaymentMethod @extends ApplicationModule
	return	{
		MenuItems: {
			parent: 'settings'
		,	id: 'paymentmethod'
		,	name: _('Payment Methods').translate()
		,	url: 'paymentmethods'
		,	index: 4
		}

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'CreditCardsList'
			,	'routes': ['creditcards', 'paymentmethods']
			,	'view': PaymentMethodCreditCardListView
			,	'defaultTemplate': {
					'name': 'creditcard_list.tpl'
				,	'displayName': 'Credit Cards List Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-credit-cards-list.png')
				}
			});

			pageType.registerPageType({
				'name': 'CreditCardDetails'
			,	'routes': ['creditcards/:id']
			,	'view': CreditCardEditView
			,	'defaultTemplate': {
					'name': 'creditcard_edit.tpl'
				,	'displayName': 'Credit Card Edit Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-credit-card-detail.png')
				}
			});
		}
	};
});
