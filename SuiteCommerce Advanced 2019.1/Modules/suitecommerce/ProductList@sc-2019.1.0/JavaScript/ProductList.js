/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductList
define('ProductList'
,	[	'ProductList.Details.View'
	,	'ProductList.Lists.View'
	,	'Profile.Model'
	,	'ProductList.Utils'

	,	'underscore'
	,	'Utils'
	]
,	function (
		ProductListDetailsView
	,	ProductListListsView
	,	ProfileModel
	,	ProductListUtils

	,	_
	,	Utils
	)
{
	'use strict';

	// @class ProductListModule @extends ApplicationModule Encapsulate all product list elements into a single module to be mounted to the application
	// Update: Keep the application reference within the function once its mounted into the application
	var ProductListModule = function ()
	{
		return {

			mountToApp: function (application)
			{
				var pageType = application.getComponent('PageType');

				// Application.ProductListModule - reference to this module
				application.ProductListModule = ProductListModule;
				application.ProductListModule.Utils = new ProductListUtils(application);

				ProfileModel.getPromise().done(application.ProductListModule.Utils.profileModelPromiseDone);

				pageType.registerPageType({
					'name': 'WishlistList'
				,	'routes': ['wishlist', 'wishlist/?*options']
				,	'view': ProductListListsView
				,	'defaultTemplate': {
						'name': 'product_list_lists.tpl'
					,	'displayName': 'Wishlist'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-wishlist.png')
					}
				});

				pageType.registerPageType({
					'name': 'WishlistDetail'
				,	'routes': ['wishlist/:id', 'wishlist/:id/?*options']
				,	'view': ProductListDetailsView
				,	'defaultTemplate': {
						'name': 'product_list_details_tpl'
					,	'displayName': 'Wishlist Detail'
					,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-wishlist-detail.png')
					}
				});
			}

			// @property {Function} MenuItems ProductLists myaccount's menu items. This is a good example of dynamic-multilevel myaccount's menuitems definition.
			// This is called from SCA.MyAccount.js and is necessary
		,	MenuItems: function (application)
			{
				if (!application.ProductListModule.Utils.isProductListEnabled())
				{
					return undefined;
				}

				var loadingList =  _('Loading list...').translate();
				var	loadingLists = _('Loading lists...').translate();

				return {
					id: 'product_list_dummy'
				,	name: application.ProductListModule.Utils.isSingleList() ? loadingList : loadingLists
				,	url: ''
				,	index: 2
				};
			}
		};
	}();

	//@class ProductList instantiate the router @extends ApplicationModule
	return ProductListModule;
});
