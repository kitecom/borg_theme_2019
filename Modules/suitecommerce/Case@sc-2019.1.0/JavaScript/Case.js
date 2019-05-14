/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Case.js
// -----------------
// Defines the Case module. (Model, Views, Router)
// @module Case
define(
	'Case'
,	[
		'SC.Configuration'
	,	'Case.List.View'
	,	'Case.Detail.View'
	,	'Case.Create.View'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Configuration
	,	CaseListView
	,	CaseDetailView
	,	CaseCreateView
	,	_
	,	Utils
	)
{
	'use strict';

	var case_menu_items = function ()
	{
		if (!isCaseManagementEnabled())
		{
			return undefined;
		}

		return {
			id:  'cases'
		,	name: _('Cases').translate()
		,	index: 5
		,	children:  [
				{
					parent: 'cases'
				,	id: 'cases_all'
				,	name: _('Support Cases').translate()
				,	url: 'cases'
				,	index: 1
				}
			,	{
					parent: 'cases'
				,	id: 'newcase'
				,	name: _('Submit New Case').translate()
				,	url: 'newcase'
				,	index: 2
				}
			]
		,	permission: 'lists.listCase.2'
		};
	};

	// Is Case functionality available for this application?
	var isCaseManagementEnabled = function ()
	{
		return SC && SC.ENVIRONMENT && SC.ENVIRONMENT.casesManagementEnabled;
	};

	// Encapsulate all Case elements into a single module to be mounted to the application
	// Update: Keep the application reference within the function once its mounted into the application
	var CaseModule = function() 
	{
		var mountToApp = function (application)
		{
			var pageType = application.getComponent('PageType');
			pageType.registerPageType({
				'name': 'CasesList'
			,	'routes': ['cases', 'cases?:options']
			,	'view': CaseListView
			,	'defaultTemplate': {
					'name': 'case_list.tpl'
				,	'displayName': 'Cases list default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});
			pageType.registerPageType({
				'name': 'CasesDetail'
			,	'routes': ['cases/:id']
			,	'view': CaseDetailView
			,	'defaultTemplate': {
					'name': 'case_detail.tpl'
				,	'displayName': 'Cases detail default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-cases-detail.png')
				}
			});
			pageType.registerPageType({
				'name': 'NewCase'
			,	'routes': ['newcase']
			,	'view': CaseCreateView
			,	'defaultTemplate': {
					'name': 'case_new.tpl'
				,	'displayName': 'Cases detail default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-cases-new.png')
				}
			});
		};
		return {
			isEnabled: isCaseManagementEnabled
		,	mountToApp: mountToApp
		,	MenuItems: case_menu_items
		};
	}();
	return CaseModule;
});