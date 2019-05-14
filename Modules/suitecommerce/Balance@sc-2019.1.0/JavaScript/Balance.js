/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Balance
define('Balance'
,	[	'Balance.View'

	,	'underscore'
	,	'Utils'
	]
,	function (
		BalanceView

	,	_
	,	Utils
	)
{
	'use strict';

	// @class Balance @extends ApplicationModule
	return	{
		MenuItems: {
			name: _('Billing').translate()
		,	id: 'billing'
		,	index: 3
		,	children: [{
				id: 'balance'
			,	name: _('Account Balance').translate()
			,	url: 'balance'
			,	index: 1
			}]
		}

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'AccountBalance'
			,	'routes': ['balance', 'balance?*params']
			,	'view': BalanceView
			,	'defaultTemplate': {
					'name': 'balance.tpl'
				,	'displayName': 'Account Balance Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-account-balance.png')
				}
			});
		}
	};
});
