/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*
@module CMSadapter

@class CMSadapter.Impl.Categories.v3
*/
define('CMSadapter.Impl.Categories.v3'
,	[
		'Categories',
		'Categories.Collection',
		'Categories.Model',
		'Facets.Router',
		'Facets.Model',
		'Facets.Browse.View',
		'Profile.Model',
		'Item.Model',
		'Item.Collection',
		'SC.Configuration',
		'Backbone',
		'Url',
		'jQuery',
		'Utils',
		'underscore'
	]
,	function (
		Categories,
		CategoriesCollection,
		CategoriesModel,
		FacetsRouter,
		FacetsModel,
		FacetsBrowseView,
		ProfileModel,
		ItemModel,
		ItemCollection,
		Configuration,
		Backbone,
		Url,
		jQuery,
		Utils,
		_
	)
{
	'use strict';

	var CMSadapterImplCategories3 = function (application, CMS)	{
		this.CMS = CMS;
		this.application = application;
		this.webStoreUrl = new Url().parse(SC.ENVIRONMENT.baseUrl);
		this.domain = this.webStoreUrl.getNetLocComponets().domain;
		this.currentDate = null;
		this.deEffectiveEndpointUrl = null;
		this.itemEndpointUrl = null;
		this.product = SC.ENVIRONMENT.BuildTimeInf.product === 'SCA' ? 'sca' : 'scs';
		this.listenForCMS();
	};

	CMSadapterImplCategories3.prototype.listenForCMS = function listenForCMS () {
		// CMS listeners - CMS tells us to do something, could fire anytime.
		var self = this;

		self.CMS.on('categories:navigate', function (promise, data)
		{
			FacetsModel.prototype.ignoreCache = true;
			CategoriesModel.prototype.ignoreCache = true;

			var url = data.url[0] !== '/' ? '/' + data.url : data.url

			Backbone.history.navigate(url, { trigger: false });
			Backbone.history.loadUrl(url);

			self.reloadCategories({ 'dontRefresh': true }).then(function()
			{
				promise.resolve();
			});
		});

		self.CMS.on('categories:reload', function (promise) {
			self.setUpEndPoints()
				.then(function(){
					self.reloadCategories()
						.then(function(){
							promise.resolve();
						})
						.fail(function(){promise.reject()});
				}).fail(function(){promise.reject()});;
		});

		self.CMS.on('site:date:changed', function(promise, data){
			self.setUpEndPoints()
				.then(function () {
					self.currentDate = data.siteDate;
					self.changeServices();//requires the date to be updated
					//reload the categories
					self.reloadCategories().then(function(){
						promise.resolve();
					}).fail(function(){promise.reject()});;
				}).fail(function(){promise.reject()});;
		});
	};

	CMSadapterImplCategories3.prototype.setUpEndPoints = function () {
		var self = this;
		if (!this.deEffectiveEndpointUrl) {
			return jQuery.getJSON(this.webStoreUrl.schema + '://' + this.webStoreUrl.netLoc + '/app/site/hosting/scriptlet.nl?script=customscript_ns_' + this.product + '_environment&deploy=customdeploy_ns_' + this.product + '_environment')
				.then(function (env) {
					self.deEffectiveEndpointUrl = 'https://' + env.backendAccountDomain + self.webStoreUrl.path.replace('{{file}}','services/DateEffectiveCategory.Service.ss');
					self.itemEndpointUrl = 'https://' + env.backendAccountDomain + '/api/items';
				});
		} else {
			return jQuery.Deferred().resolve();
		}
	};

	CMSadapterImplCategories3.prototype.reloadCategories = function (options) {
		if (this.currentDate !== null) {
			var self = this;
			var collection = new CategoriesCollection();
			return collection.fetch({
				dataType: 'jsonp',
				jsonp: 'jsonp_callback'
			}).done(function (menu) {
				Categories.setTopLevelCategoriesUrlComponents(menu);
				//update the router with new urls
				var router = new FacetsRouter(self.application);
				router.addUrl(Categories.getTopLevelCategoriesUrlComponent(), 'categoryLoading');
				Categories.addToNavigationTabs(menu);
				if (!(options && options.dontRefresh))
				{
					self.refreshPLP();
				}
			});
		} else {
			return jQuery.Deferred().reject();
		}
	};

	CMSadapterImplCategories3.prototype.refreshPLP = function () {
		var currentBaseUrl = Backbone.history.getFragment().split('/')[0];
		if (_.find(Categories.getTopLevelCategoriesUrlComponent(), function (cat){return cat.substring(1) === currentBaseUrl;})){
			//if is a category, reload the page
			Backbone.history.loadUrl(Backbone.history.getFragment());
		}
	};

	CMSadapterImplCategories3.prototype.changeServices = function () {
		var self = this;
		CategoriesModel.prototype.url = function (){
			var url = _.addParamsToUrl(
				self.deEffectiveEndpointUrl
			,	{
					'date': self.currentDate,
					'domain': self.domain,
					'n': SC.ENVIRONMENT.siteSettings.siteid,
					'c': SC.ENVIRONMENT.companyId
				}
			);
			return url;
		};
		CategoriesModel.prototype.fetch = _.wrap(CategoriesModel.prototype.fetch, function (fn, options){
			options = _.extend(options || {}, {
				dataType: 'jsonp',
				jsonp: 'jsonp_callback'
			});
			return fn.call(this, options);
		});

		CategoriesCollection.prototype.url = function() {
			var url = _.addParamsToUrl(
				self.deEffectiveEndpointUrl
			,	{
				'menuLevel': Configuration.get('categories.menuLevel'),
				'date': self.currentDate,
				'domain': self.domain,
				'n': SC.ENVIRONMENT.siteSettings.siteid,
				'c': SC.ENVIRONMENT.companyId
				}
			);
			return url;
		};
		ProfileModel.prototype.getSearchApiUrl = function(){
			return self.itemEndpointUrl;
		};
		function wrapItemsApiFetch(modelOrCollection) {
			modelOrCollection.prototype.fetch = _.wrap(modelOrCollection.prototype.fetch, function (fn, options) {
				options = Utils.deepExtend(options || {}, {
					cache: false,
					data: {
						as_of_date: self.currentDate
					},
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true
				});
				//The 'true' value prevents jQuery ajax from sending the 'X-SC-Touchpoint' header, it's not supported
				//by CORS request to the items API
				SC.dontSetRequestHeaderTouchpoint = true;
				var fethReturn = fn.call(this, options);
				SC.dontSetRequestHeaderTouchpoint = false;
				return fethReturn;
			});
		}
		wrapItemsApiFetch(ItemModel);
		wrapItemsApiFetch(ItemCollection);
		wrapItemsApiFetch(FacetsModel);
	};
	return CMSadapterImplCategories3;
});
