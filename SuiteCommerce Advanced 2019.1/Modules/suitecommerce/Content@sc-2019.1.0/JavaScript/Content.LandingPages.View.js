/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Content
define(
	'Content.LandingPages.View'
,	[	'Content.DataModels'
	,	'Content.EnhancedViews'
	,	'SC.Configuration'

	,	'landing_page.tpl'
	,	'landing_page_my_account.tpl'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		DataModels
	,	EnhancedViews
	,	Configuration

	,	landing_page_tpl
	,	landing_page_my_account_tpl

	,	Backbone
	,	jQuery
	)
{
	'use strict';

	// Categories is an optional dependency
	var Categories = false;
	try {
		Categories = require('Categories');
	}
	catch (e)
	{
		//console.log('Couldn\'t load Categories. ' + e);
	}

	// @class Content.LandingPages.View
	// Uses the Content.DataModels to connect to the servers. Tho' most of the content is driven by the content service
	// we need a view to extend upon @extend Backbone.View
	return Backbone.View.extend({

		template: Configuration.get('currentTouchpoint') === 'customercenter' ? landing_page_my_account_tpl : landing_page_tpl

	,	title: ''
	,	page_header: ''
	,	attributes: {
			'id': 'landing-page'
		,	'class': 'landing-page'
		}
	,	events: {}

	,	initialize: function (options)
		{
			this.application = options.application;
			this.options = options;
			this.url = Backbone.history && Backbone.history.fragment;
			this.options.layout = this.application.getLayout()
		}

	,	beforeShowContent: function beforeShowContent()
		{
			var self = this
			,	promise = jQuery.Deferred()
			,	url = Backbone.history.fragment
			,	page_url = url.split('?')[0]; // remove options

			DataModels.loadPage('/' + page_url, function (page)
			{
				if (page)
				{
					EnhancedViews.overrideViewSettings(self, page);
					self.page_header = page.get('pageheader');
					self.page = page;
					promise.resolve();
				}
				else
				{
					promise.reject();
					self.application.getLayout().notFound();
				}
			});

			return promise;
		}

		// @method getBreadcrumbPages It will try to figure the breadcrumb out of the url
	,	getBreadcrumbPages: function ()
		{
			var breadcrumb = [];

			breadcrumb.push({
				href: this.url
			,	text: this.page_header
			});

			return breadcrumb;
		}

		// @method getContext @returns {Content.LandingPages.View.Context}
	,	getContext: function ()
		{
			// @class Content.LandingPages.View.Context
			return {
				// @property {Boolean} pageHeaderAndNotInModal
				pageHeaderAndNotInModal: this.page_header && !this.inModal
				// @property {String} pageHeader
			,	pageHeader: this.page_header
				// @property {Boolean} pageAndPageContent
			,	pageAndPageContent: this.page && this.page.get('content')
				// @property {String} pageContent
			,	pageContent: this.page.get('content')
			};
		}

	});
});
