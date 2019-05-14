/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Receipt.js
// -----------------
// Defines the Receipt module (Model, Collection, Views, Router)
define('Receipt'
,	[
		'Receipt.Details.View'
	,	'Utils'
	]
,	function (
		ReceiptDetailsView
	,	Utils
	)
{
	'use strict';

	return	{
		mountToApp:  function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'OrderDetail'
			,	'routes': ['receiptshistory/view/:id']
			,	'view': ReceiptDetailsView
			,	'defaultTemplate': {
					'name': 'receipt_details.tpl'
				,	'displayName': 'Order Detail Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-order-detail.png')
				}
			});
		}
	};
});
