/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/* global CMS: false */
// @module CMSadapter
define('CMSadapter'
,	[	'Backbone'
	,	'CMSadapter.Page.Router'
	,	'CMSadapter.Page.Collection'
	,	'CMSadapter.Impl.Enhanced'
	,	'CMSadapter.Component'
	,	'SC.Configuration'

	,	'jQuery'
	]
,	function (
		Backbone
	,	CMSadapterPagePageRouter
	,	CMSadapterPagePageCollection
	,	CMSadapterImplEnhanced
	,	CMSadapterComponent
	,	Configuration

	,	jQuery
	)
{
	'use strict';

	// @class CMSadapter responsible of starting both the adapter implementation.
	// Assumes cms.js is already loaded
	// @extend ApplicationModule
	return {

		mountAdapter: function (application)
		{
			if (Configuration.get('cms.useCMS'))
			{
				application.registerComponent(CMSadapterComponent(application));

				var routes = this.initPageRoutes(application);

				this.adapterEnhanced = new CMSadapterImplEnhanced(application, routes);
				this.installBackboneViewPlugins(application);

				if (Configuration.get('cms.adapterVersion') === '2' || SC.isDevelopment)
				{
					this.loadScript(application, routes);
				}
				else
				{
					this.initAdapter(application, routes);
				}
			}

			return this.postMountAdapter(application);
		}

	,	loadScript: function loadScript(application, routes)
		{
			var self = this;

			jQuery.getScript('/cms/' + Configuration.get('cms.adapterVersion') + '/cms.js')
				.done(function()
				{
					self.initAdapter(application, routes);
				});
		}

	,	initAdapter: function initAdapter(application, landingRouter)
		{
			if (typeof CMS !== 'undefined')
			{
				this.initAdapterImpls(application, CMS, landingRouter);

				Backbone.trigger('cms:loaded', CMS);
			}

		}

	,	initPageRoutes: jQuery.noop

	,	installBackboneViewPlugins: jQuery.noop

	,	initAdapterImpls: jQuery.noop

	,	postMountAdapter: jQuery.noop
	};
});
