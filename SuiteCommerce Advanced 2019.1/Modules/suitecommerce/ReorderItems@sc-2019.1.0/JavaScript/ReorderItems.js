/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@Module ReorderItems
define('ReorderItems'
,	[
		'SC.Configuration'
	,	'ReorderItems.List.View'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	ReorderItemsListView
	,	_
	,	Utils
	)
{
	'use strict';

	return	{


		MenuItems: function () 
		{
			var isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

			return {
				parent: 'orders'
			,	id: 'reorderitems'
			,	name: _('Reorder Items').translate()
			,	url: 'reorderItems'
			,	index: 4
			,	permission: isSCISIntegrationEnabled ? 'transactions.tranFind.1,transactions.tranPurchases.1' : 'transactions.tranFind.1,transactions.tranSalesOrd.1'
			};
		}

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');
			pageType.registerPageType({
				'name': 'ReorderHistory'
			,	'routes': ['reorderItems', 'reorderItems?:options']
			,	'view': ReorderItemsListView
			,	'defaultTemplate': {
					'name': 'reorder_items_list.tpl'
				,	'displayName': 'Reorder history default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});
		}
	};
});