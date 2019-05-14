/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CMSadapter
define(
	'CMSadapter.Page.Router'
,	[
		'CMSadapter.Landing.View'
	,	'CMSadapter.Page.Collection'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		CMSadapterLandingView
	,	CMSadapterPageCollection

	,	Backbone
	,	_
	,	jQuery
	,	Utils
	)
{
	'use strict';

	// @class CMSadapter.Page.Router
	function CMSadapterPageRouter (application, collection)
	{
		this.application = application;
		this.allPages = collection;
		this.enhancedPages = new Backbone.Collection();
		this.initRouter();
	}

	CMSadapterPageRouter.prototype._addEnhancedPage = function _addEnhancedPage(page)
	{
		var enhancedPage = this.enhancedPages.where({ 'urlPath': page.get('urlPath') }) || this.enhancedPages.where({ 'url': page.get('url') });

		if (enhancedPage)
		{
			this.enhancedPages.remove(enhancedPage);
		}

		this.enhancedPages.add(page);
	}

	CMSadapterPageRouter.prototype.initRouter = function initRouter()
	{
		var pageType = this.application.getComponent('PageType')
		,	self = this;

		this.allPages.each(function(page)
		{
			if (page.get('type') === 1)
			{
				var type = page.get('pageTypeName') || 'cms-landing-page'
				,	url = page.get('urlPath') || page.get('url');

				pageType._addPage(page, type, url);
			}
			else
			{
				self._addEnhancedPage(page);
			}
		});

		pageType.registerPageType({
			'name': 'cms-landing-page'
		,	'view': CMSadapterLandingView
		,	'defaultTemplate': {
				'name': 'cms_landing_page.tpl'
			,	'displayName': 'Landing Pages Default'
			,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-cms-landing.png')
			}
		});
	};

	// @method getPageForFragment
	// A handcrafted method for getting the page model given a url.
	CMSadapterPageRouter.prototype.getPageForFragment = function getPageForFragment()
	{
		var pageType = this.application.getComponent('PageType')
		,	fragment = Backbone.history.fragment || '/';

		fragment = fragment.split('?')[0]; //remove options

		var page = pageType._getPage(fragment);

		if (!page)
		{
			page = this.enhancedPages.find(function(page)
			{
				return (page.get('urlPath') === fragment) || (page.get('url') === fragment);
			});
		}

		return page;
	}

	CMSadapterPageRouter.prototype.addLandingRoute = function addLandingRoute(page, originalUrl)
	{
		var pageType = this.application.getComponent('PageType')
		,	type = page.pageTypeName || 'cms-landing-page'
		,	url = page.urlPath || page.url
		,	model = new Backbone.Model(page);

		if (model.get('type') === 1)
		{
			pageType._addPage(model, type, url);

			pageType.registerPageType({
				'name': type || 'cms-landing-page'
			,	'routes': [url, url  + '?*options']
			});
		}
		else
		{
			this._addEnhancedPage(model);
		}
	}

	return CMSadapterPageRouter;
});
