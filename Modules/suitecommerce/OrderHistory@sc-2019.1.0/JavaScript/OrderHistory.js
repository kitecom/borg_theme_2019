/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderHistory
// Implements the experience of seeing all the customer Orders experience, this is the 'Order History' experience in MyAccount. Includes the Order module (Model, Collection, Views, Router)
define('OrderHistory'
,	[
		'OrderHistory.List.View'
	,	'OrderHistory.Details.View'
	,	'SC.Configuration'
	,	'underscore'
	,	'Utils'
	]
,	function (
		OrderHistoryListView
	,	OrderHistoryDetailsView
	,	Configuration
	,	_
	,	Utils
	)
{
	'use strict';

	// @class OrderHistory @extends ApplicationModule
	return	{
		// @property {MenuItem} MenuItems
		MenuItems: function ()
		{
			var isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

			return {
				id: 'orders'
			,	name: _('Purchases').translate()
			,	index: 1
			,	permission: isSCISIntegrationEnabled ? 'transactions.tranPurchases.1,transactions.tranEstimate.1,transactions.tranPurchasesReturns.1' : 'transactions.tranSalesOrd.1,transactions.tranEstimate.1,transactions.tranRtnAuth.1'
			,	permissionOperator: 'OR'
			,	children: [{
					id: 'purchases'
				,	name: _('Purchase History').translate()
				,	url: 'purchases'
				,	index: 1
				,	permission: isSCISIntegrationEnabled ? 'transactions.tranFind.1,transactions.tranPurchases.1' : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
				}]
			};
		}

		// @method mountToApp
	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');
			var routes = ['purchases', 'purchases?:options', 'open-purchases', 'open-purchases?:options'];
			if(Configuration.get('siteSettings.isSCISIntegrationEnabled', false))
			{
				routes.push('instore-purchases');
				routes.push('instore-purchases?:options');
			}
			pageType.registerPageType({
				'name': 'PurchaseHistory'
			,	'routes': routes
			,	'view': OrderHistoryListView
			,	'defaultTemplate': {
					'name': 'order_history_list.tpl'
				,	'displayName': 'Purchase history default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});
			pageType.registerPageType({
				'name': 'PurchaseDetail'
			,	'routes': ['purchases/view/:recordtype/:id']
			,	'view': OrderHistoryDetailsView
			,	'defaultTemplate': {
					'name': 'order_history_details.tpl'
				,	'displayName': 'Purchase history details default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-purchase-detail.png')
				}
			});
		}
	};
});
