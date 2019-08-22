/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module PageType.Component
define(
	'PageType.Component'
,	[
		'SC.BaseComponent'
	,	'PageType.Router'
	,	'SC.Configuration'
	,	'ErrorManagement.PageNotFound.View'

	,	'jQuery'
	,	'underscore'
	,	'Backbone'
	]
,	function (
		SCBaseComponent
	,	PageTypeRouter
	,	Configuration
	,	PageNotFoundView

	,	jQuery
	,	_
	,	Backbone
	)
{
	'use strict';

	return function PageTypeComponentGenerator (application)
	{
		var Router = new PageTypeRouter(application);
		var CMSReady = jQuery.Deferred();
		var CMS;
		var siteId = Configuration.get('siteSettings.siteid');
		var routes = {};
		var pages = {};
		var allPageTypes = {};

		var templates = {};
		var types = {};
		var lastContext = {
			'context': {}
		,	'data': {
				'promiseCMS': jQuery.Deferred()
			,	'rendered': false
			,	'timeoutId': 0
			}
		};

		Backbone.on('cms:loaded', function(cms)
		{
			CMS = cms;
			CMSReady.resolve();
		});

		CMSReady.done(function()
		{
			CMS.on('page:content:set', function (promise, ccts, contentContext)
			{
				var fullContext = PageTypeComponent._validateCurrentContext(contentContext);

				if (fullContext)
				{
					var data = fullContext.data;

					if (data.rendered)
					{
						var cctComponent = PageTypeComponent.application.getComponent('CMS');

						cctComponent.addContents();
					}
					else if (data.timeoutId)
					{
						 clearTimeout(data.timeoutId)
					}

					data.promiseCMS.resolve();
				}
				else
				{
					data.promiseCMS.reject();
				}
			});
		});

		var PageTypeComponent = SCBaseComponent.extend({

			componentName: 'PageType'

		,	application: application

		,	_validateCurrentContext: function _validateCurrentContext(context)
			{
				if (_.isEqual(lastContext.context, context))
				{
					return lastContext;
				}
				else
				{
					return null;
				}
			}

		,	_getPage: function _getPage(url)
			{
				return pages[url];
			}

		,	_addPage: function _addPage(page, type, url)
			{
				if (type && url)
				{
					if (!routes[type])
					{
						routes[type] = [];
					}

					if (_.indexOf(routes[type], url) === -1)
					{
						routes[type].push(url);
					}

					pages[url] = page;
				}
			}

		,	_addRoute: function _addRoute(options)
			{
				_.each(options.routes, function(route)
				{
					if (route[0] === '/')
					{
						route = route.substr(1);
					}

					Router.route(route, options.type);
				});
			}

		,	getPageTypes: function getPageTypes()
			{
				var data = {
					layouts: templates
				,	types: {}
				};

				_.each(types, function(value, key)
				{
					if (value.registered)
					{
						data.types[key] = value;
					}
				});

				return data;
			}

		,	registerTemplate: function registerTemplate(templateData)
			{
				var template = templateData.template;

				if (!templates[template.name])
				{
					templates[template.name] = {
						'name': template.displayName
					,	'thumbnail': template.thumbnail
					};
				}

				_.each(templateData.pageTypes, function(pageType)
				{
					if (!types[pageType])
					{
						types[pageType] = {
							'supportedLayoutIds': []
						};
					}

					if (_.indexOf(types[pageType].supportedLayoutIds, template.name) === -1)
					{
						types[pageType].supportedLayoutIds.push(template.name);
					}
				});
			}

		,	_CmsViewPromises: function _CmsViewPromises(options)
			{
				var url = Backbone.history.fragment && Backbone.history.fragment.split('?')[0] || Backbone.history.location.hash
				,	path = url[0] === '/' ? url : '/' + url;

				var context = {
					'path': options.path || path
				,	'site_id': options.site_id || Configuration.get('siteSettings.siteid')
				,	'page_type': options.page_type || ''
				};

				var data = {
					'promiseCMS': jQuery.Deferred()
				,	'rendered': false
				,	'timeoutId': 0
				};

				lastContext = {
					'context': context
				,	'data': data
				};

				var self = this;
				var view = options.view;

				var promise = jQuery.Deferred();

				var promiseView = view ? jQuery.Deferred().resolve() : jQuery.Deferred().reject();

				if (view && view.beforeShowContent)
				{
					promiseView = view.beforeShowContent();
				}

				if (!Configuration.get('cms.useCMS'))
				{
					data.promiseCMS.resolve();
				}
				else
				{
					CMSReady.done(function()
					{
						self.application.getLayout().once('beforeAppendView', function()
						{
							if (self._validateCurrentContext(context) && !data.rendered)
							{
								var cctComponent = self.application.getComponent('CMS');

								cctComponent.addContents();
							}
						});

						CMS.once('context:get', function (promise)
						{
							promise.resolve(context);
						});

						CMS.trigger('app:page:changed'); // Add context again as parameter and remove 'context:get' when issue is fixed

						promiseView.done(function()
						{
							data.timeoutId = setTimeout(function()
							{
								if (self._validateCurrentContext(context))
								{
									data.promiseCMS.resolve();
									data.rendered = true;
								}
								else
								{
									data.promiseCMS.reject();
								}
							}, Configuration.get('cms.contentWait', 200));
						});
					});
				}

				jQuery.when(data.promiseCMS, promiseView).done(function()
				{
					promise.resolve();
				});

				return promise;
			}

		,	registerPageType: function registerPageType(pagetype)
			{
				if (pagetype.name && pagetype.view)
				{
					allPageTypes[pagetype.name] = pagetype;
				}

				if (pagetype.name && pagetype.routes && !pagetype.view && allPageTypes[pagetype.name])
				{
					pagetype.view = allPageTypes[pagetype.name].view;
				}

				var callback = function()
				{
					var view;

					if (pagetype.view)
					{
						var url = Backbone.history.fragment;
						url = url.split('?')[0]; // remove options
						var page = pages[url];

						var options = {
							application: application
						,	container: application
						,	routerArguments: arguments
						};


						if (page)
						{
							options.pageInfo = page;
						}

						view = new pagetype.view(options);
					}
					else if (pagetype.callback)
					{
						view = pagetype.callback.apply(arguments);
					}

					var data = {
						'view': view
					,	'page_type': pagetype.name
					};

					PageTypeComponent._CmsViewPromises(data).done(function()
					{
						view._pagetype = true;

						var showContentPromise = view.showContent();

						showContentPromise && showContentPromise.done(function()
						{
							if (Configuration.get('cms.useCMS'))
							{
								CMS.trigger('app:page:rendered');
							}
						});
					});
				};

				if (pagetype.routes)
				{
					_.each(pagetype.routes, function(route)
					{
						if (route[0] === '/')
						{
							route = route.substr(1);
						}

						Router.route(route, callback);
					});
				}
				else
				{
					Router[pagetype.name] = callback;

					if (routes[pagetype.name])
					{
						var route;

						while(route = routes[pagetype.name].pop())
						{
							if (route[0] === '/')
							{
								route = route.substr(1);
							}

							Router.route(route, pagetype.name);
						}
					}
				}

				if (!types[pagetype.name])
				{
					types[pagetype.name] = {
						'supportedLayoutIds': []
					};
				}

				types[pagetype.name].registered = true;

				if (pagetype.defaultTemplate)
				{
					templates[pagetype.defaultTemplate.name] = {
						'name': pagetype.defaultTemplate.displayName
					,	'thumbnail': pagetype.defaultTemplate.thumbnail
					}

					types[pagetype.name].defaultLayoutId = pagetype.defaultTemplate.name;
					types[pagetype.name].supportedLayoutIds.push(pagetype.defaultTemplate.name);
				}
			}
		});

		return PageTypeComponent;
	}
});
