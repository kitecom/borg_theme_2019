/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductDetails Implements the full experience of the Product Details Page (PDP)
// Consists on a router, a model and the DetailsView with an image gallery view to show the product images
define(
	'ProductDetails'
,	[
		'ProductDetails.Full.View'
	,	'ProductDetails.QuickView.View'
	,	'SC.Configuration'
	,	'ProductDetails.Component'
	,	'Utils'

	]
,	function (
		ProductDetailsFullView
	,	ProductDetailsQuickView
	,	Configuration
	,	ProductDetailsComponent
	,	Utils
	)
{
	'use strict';

	//@class ProductDetails instantiate the router and publicly expose the PDP Component @extends ApplicationModule
	return {
		//@method mountToApp
		//@return {ProductDetails.Component}
		mountToApp: function (application)
		{
			if (Configuration.get('modulesConfig.ProductDetails.startRouter', false))
			{
				var pageType = application.getComponent('PageType');

				pageType.registerPageType({
					'name': 'ProductDetails.Full.View'
				,	'routes': [':url', /^(.*?)$/, 'product/:id', 'product/:id?:options']
				,	'view':ProductDetailsFullView
				,	'defaultTemplate': {
						'name': 'product_details_full.tpl'
					,	'displayName': 'Product Details Full Default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-PDP.png')
					}
				});
				pageType.registerPageType({
					'name': 'ProductDetails.QuickView.View'
				,	'routes': [':url&showinmodal=T', ':url?showinmodal=T', /^(.*?)(\?|\&)showinmodal=T$/, 'product/:id?showinmodal=T', 'product/:id?:options&showinmodal=T']
				,	'view':ProductDetailsQuickView
				,	'defaultTemplate': {
						'name': 'product_details_quickview.tpl'
					,	'displayName': 'Product Details QuickView Default'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-PDP-quick-view.png')
					}
				});
			}

			return ProductDetailsComponent(application);
		}
	};
});
