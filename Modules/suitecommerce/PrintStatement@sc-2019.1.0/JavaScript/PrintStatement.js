/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module PrintStatement
define(
	'PrintStatement'
,	[	'PrintStatement.View'

	,	'underscore'
	,	'Utils'
	]
,	function (
		PrintStatementView
	,	_
	,	Utils
	)
{
	'use strict';
	//@class PrintStatement
	return	{
		//@property {Object} MenuItems
		MenuItems: {
			parent: 'billing'
		,	id: 'printstatement'
		,	name: _('Print a Statement').translate()
		,	url: 'printstatement'
		,	index: 4
		,	permission: 'transactions.tranStatement.2'
		}
		//@method mountToApp
	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType')

			pageType.registerPageType({
				'name': 'PrintStatement'
			,	'routes': ['printstatement', 'printstatement?*params']
			,	'view': PrintStatementView
			,	'defaultTemplate': {
					'name': 'print_statement.tpl'
				,	'displayName': 'PrintStatement Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-printStatement.png')
				}
			});
		}
	};
});
