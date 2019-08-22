/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define('Quote'
,	[
		'Quote.List.View'
	,	'Quote.Details.View'
	,	'underscore'
	,	'Utils'
	]
,	function (
		QuoteListView
	,	QuoteDetailsView
	,	_
	,	Utils
	)
{
	'use strict';

	//@class Quote @extend ApplicationModule
	return	{
		//@property {MenuItem} MenuItem
		MenuItems: {
			parent: 'orders'
		,	id: 'quotes'
		,	name: _('Quotes').translate()
		,	url: 'quotes'
		,	index: 5
		,	permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
		}

		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {QuoteRouter} Returns an instance of the quote router used by the current module
	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');
			pageType.registerPageType({
					'name': 'QuotesHistory'
				,	'routes': ['quotes', 'quotes?:options']
				,	'view': QuoteListView
				,	'defaultTemplate': {
						'name': 'quote_list.tpl'
					,	'displayName': 'Quotes default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});
			pageType.registerPageType({
					'name': 'QuotesDetail'
				,	'routes': ['quotes/:id']
				,	'view': QuoteDetailsView
				,	'defaultTemplate': {
						'name': 'quote_details.tpl'
					,	'displayName': 'Quotes details default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-quote-details.png')
				}
			});
		}
	};
});
