/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ReturnAuthorization
define('ReturnAuthorization'
,	[
		'ReturnAuthorization.List.View'
	,	'ReturnAuthorization.Detail.View'
	,	'ReturnAuthorization.Form.View'
	,	'ReturnAuthorization.Confirmation.View'
	,	'SC.Configuration'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ReturnAuthorizationListView
	,	ReturnAuthorizationDetailView
	,	ReturnAuthorizationFormView
	,	ReturnAuthorizationConfirmationView
	,	Configuration
	,	_
	,	Utils
	)
{
	'use strict';

	// Defines the Return Authorization module (Model, Collection, Views, Router)
	return	{
		MenuItems: function () 
		{
			var isSCISIntegrationEnabled = Configuration.get('siteSettings.isSCISIntegrationEnabled', false);

			return {
				parent: 'orders'
			,	id: 'returns'
			,	name: _('Returns').translate()
			,	url: 'returns'
			,	index: 2
			,	permission: isSCISIntegrationEnabled ? 'transactions.tranFind.1,transactions.tranPurchasesReturns.1' : 'transactions.tranFind.1,transactions.tranRtnAuth.1'
			};
		}

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');
			pageType.registerPageType({
					'name': 'ReturnsHistory'
				,	'routes': ['returns', 'returns?:options']
				,	'view': ReturnAuthorizationListView
				,	'defaultTemplate': {
						'name': 'return_authorization_list.tpl'
					,	'displayName': 'Return authorization list default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});
			pageType.registerPageType({
					'name': 'ReturnsDetail'
				,	'routes': ['returns/:recordtype/:id', 'returns/:recordtype/:id?:options']
				,	'view': ReturnAuthorizationDetailView
				,	'defaultTemplate': {
					'name': 'return_authorization_detail.tpl'
					,	'displayName': 'Return authorization details default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-return-detail.png')
				}
			});
			pageType.registerPageType({
				'name': 'returnAuthorizationFrom'
				,	'routes': ['returns/new/:recordtype/:id']
				,	'view': ReturnAuthorizationFormView
				,	'defaultTemplate': {
					'name': 'return_authorization_form.tpl'
					,	'displayName': 'Return authorization form default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-return-authorization-form.png')
				}
			});
			pageType.registerPageType({
				'name': 'returnAuthorizationConfirmation'
			,	'routes': ['returns/confirmation/:recordtype/:id']
			,	'view': ReturnAuthorizationConfirmationView
			,	'defaultTemplate': {
					'name': 'return_authorization_confirmation.tpl'
				,	'displayName': 'Return authorization confirmation default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-return-authorization-confirmation.png')
				}
			});
		}
	};
});
