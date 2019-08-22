/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CMSadapter
// @class CMSadapter.v3
define('CMSadapter.v3'
,	[	'Backbone'
	,	'CMSadapter'
	,	'CMSadapter.Impl.Core.v3'
	,	'CMSadapter.Impl.Landing.v3'
	,	'CMSadapter.Impl.Categories.v3'
	,	'CMSadapter.Impl.CustomContentType'
	,	'CMSadapter.Impl.ThemeCustomizerPreview'
	,	'CMSadapter.Impl.Merchandising.v3'
	,	'CMSadapter.Plugin.RecollectCMSSelectors'
	,	'CMSadapter.Plugin.PostRender'
	,	'CMSadapter.Page.Router'
	,	'CMSadapter.Page.Collection'


	,	'underscore'
	]
,	function (
		Backbone
	,	CMSadapter
	,	CMSadapterImplCore3
	,	CMSadapterImplLanding3
	,	CMSadapterImplCategories3
	,	CMSadapterImplCustomContentType
	,	CMSadapterImplThemeCustomizerPreview
	,	CMSadapterImplMerchandising3
	,	CMSadapterPluginRecollectCMSSelectors
	,	CMSadapterPluginPostRender
	,	CMSadapterPagePageRouter
	,	CMSadapterPagePageCollection

	,	_
	)
{
	'use strict';

	// @class CMSadapter responsible of starting both the adapter implementation and cms landing pages router.
	// Assumes cms.js is already loaded
	// @extend ApplicationModule
	return _.extend({}, CMSadapter, {

		installBackboneViewPlugins: function installBackboneViewPlugins(application)
		{
			Backbone.View.postCompile.install(CMSadapterPluginRecollectCMSSelectors(application));
			Backbone.View.postCompile.install(CMSadapterPluginPostRender(application));
		}

	,	initAdapterImpls: function initAdapterImpls(application, cmsObject, landingRouter)
		{

			this.adapterLanding = new CMSadapterImplLanding3(application, cmsObject, landingRouter);
			this.adapterCategories = new CMSadapterImplCategories3(application, cmsObject);
			this.adapterCustomContentTypes = new CMSadapterImplCustomContentType(application, cmsObject);
			this.adapterThemeCustomizerPreview = new CMSadapterImplThemeCustomizerPreview(application, cmsObject);
			this.adapterMerchandising = new CMSadapterImplMerchandising3(application, cmsObject);
			//CMSadapterImplCore3 must be the last on been created, constructor triggers the "app:ready" event
			this.adapterCore = new CMSadapterImplCore3(application, cmsObject);
		}

		// @method initPageRoutes Register the landing pages PageType and urls using bootstrapped data.
	,	initPageRoutes: function initPageRoutes(application)
		{
			var pages = SC.ENVIRONMENT.CMS && SC.ENVIRONMENT.CMS.pages && SC.ENVIRONMENT.CMS.pages.pages || [];
			var collection = new CMSadapterPagePageCollection(pages);

			return new CMSadapterPagePageRouter(application, collection);
		}
	});
});
