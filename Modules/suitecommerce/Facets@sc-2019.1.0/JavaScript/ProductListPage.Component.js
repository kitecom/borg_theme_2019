/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Facets
define('ProductListPage.Component'
,	[
		'SC.VisualComponent'
	,	'Facets.Model'
	,	'Facets.Translator'
	,	'AjaxRequestsKiller'

	,	'Utils'
	,	'underscore'
	,	'jQuery'
	,	'Backbone'
	]
,	function (
		SCVisualComponent
	,	FacetsModel
	,	FacetsTranslator
	,	AjaxRequestsKiller

	,	Utils
	,	_
	,	jQuery
	,	Backbone
	)
{
	'use strict';

	return function ProductListPageComponentGenerator (application)
	{
		// @class ProductListPage.Component The ProductListPage component let's the user interact with most important aspect of the
		// Product List Page, like setting options, changing quantity, and obtain item's related information. @extend SC.VisualComponent @public @extlayer
		var privateComponent = SCVisualComponent.extend({

			componentName: 'PLP'

		,	application: application

			// @method _isViewFromComponent Indicate if the passed-in the View is a PDP of the current component
			// @private
			// @param {Backbone.View} view Any view of the system
			// @return {Boolean} True in case the passed in View is a PDP of the current Component, false otherwise
		,	_isViewFromComponent: function _isViewFromComponent (view)
			{
				view = view || this.viewToBeRendered || this.application.getLayout().getCurrentView();

				var view_identifier = this._getViewIdentifier(view)
				,	view_prototype_id = view && this._getViewIdentifier(view.prototype);

				if (view && (view_identifier === this._PLP_VIEW_ID || view_prototype_id === this._PLP_VIEW_ID))
				{
					this.current_view = view;
					return true;
				}
				else
				{
					return false;
				}
			}

			// @method _getViewIdentifier Given a view that belongs to the current component, returns the "type"/"kind" of view. This is used to determine what view among all the view of the current component is being shown
			// @private
			// @param {Backbone.View} view
			// @return {String}
		,	_getViewIdentifier: function _getViewIdentifier (view)
			{
				return view && view.attributes && view.attributes.id;
			}

		,	DEFAULT_VIEW: 'Facets.Browse.View'

		,	PLP_VIEW: 'Facets.Browse.View'

		,	_PLP_VIEW_ID: 'facet-browse'

			// @method getPagination Return the info of the current options in the PLP
			// @return {Object} | NULL
		,	getPagination: function getPagination()
			{
				if (this._isViewFromComponent())
				{
					return this.current_view.getPagination();
				}
			}

			// @method setCurrentPage Go to the indicated page
			// @param {Object} options
			// @return {jQuery.Deferred}
		,	setCurrentPage: function setPage(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						if (!_.isNumber(options.currentPage))
						{
							this._reportError('INVALID_PARAM', 'Invalid parameter "currentPage". It must be a valid number');
						}
						else if (options.currentPage <= 0)
						{
							this._reportError('INVALID_PARAM', 'Parameter "currentPage" must be greater than 0');
						}
						else if (options.currentPage > this.current_view.totalPages)
						{
							this._reportError('INVALID_PARAM', 'Parameter "currentPage" must be lesser than ' + this.current_view.totalPages);
						}

						var url = this.current_view.translator.cloneForOption('page', options.currentPage).getUrl();

						return this.current_view.setEvent('CurrentPage', options.currentPage).then(function ()
						{
							Backbone.history.navigate(url, { trigger: true });
						});
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}
				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);

				}
			}

			// @method _getOption Given an option and a list of options, it will return the data of the current selected option
			// @private
			// @param {Object} options
			// @return {Array}
		,	_getOption: function _getOption (options)
			{
				var option = this.current_view.translator.getOptionValue(options.option)
				,	result = _.find(options.list_options, function(list_option)
				{
					return list_option.id === String(option);
				});

				return Utils.deepCopy(result);
			}

			// @method _getOption Given an option, it will return the data of all the options
			// @private
			// @param {Object} options
			// @return {Array}
		,	_getAllOptions: function _getAllOptions (options)
			{
				var option = this.current_view.translator.getOptionValue(options.option)
				,	list_options = Utils.deepCopy(options.list_options);

				_.each(list_options, function(list_option)
				{
					if (list_option.id === String(option))
					{
						list_option.active = true;
					}
				});

				return list_options;
			}

			// @method getSorting Get the info of the active sorting option
			// @return {Object} | NULL
		,	getSorting: function getSorting()
			{
				if (this._isViewFromComponent())
				{
					return this._getOption({ option: 'order', list_options: this.current_view.sortOptions });
				}
			}

			// @method getAllSorting Get the info of all the sorting option
			// @return {Array} | NULL
		,	getAllSorting: function getAllSorting()
			{
				if (this._isViewFromComponent())
				{
					return this._getAllOptions({ option: 'order', list_options: this.current_view.sortOptions });
				}
			}

			// @method setSorting Set the sorting option in the PLP
		,	setSorting: function setSorting(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						var sortings = this.current_view.sortOptions
						,	sorting = _.find(sortings, function(sort)
						{
							return sort.id === options.sorting;
						});

						if (!sorting)
						{
							this._reportError('INVALID_SORTING', 'Does not exists a sorting with the id: ' + options.sorting);
						}
						else
						{
							var url = this.current_view.translator.cloneForOption('order', options.sorting).getUrl();

							return this.current_view.setEvent('Sorting', options.sorting).then(function ()
							{
								Backbone.history.navigate(url, { trigger: true });
							});
						}
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}
				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

			// @method getDisplay Get the info of the active display option
			// @return {Object} | NULL
		,	getDisplay: function getDisplay()
			{
				if (this._isViewFromComponent())
				{
					return this._getOption({ option: 'display', list_options: this.current_view.itemsDisplayOptions });
				}
			}

			// @method getAllDisplay Get the info of all the display option
			// @return {Array} | NULL
		,	getAllDisplay: function getAllDisplay()
			{
				if (this._isViewFromComponent())
				{
					return this._getAllOptions({ option: 'display', list_options: this.current_view.itemsDisplayOptions });
				}
			}

			// @method setDisplay Set the display option in the PLP
		,	setDisplay: function setDisplay(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						var displays = this.current_view.itemsDisplayOptions
						,	display = _.find(displays, function(display)
						{
							return display.id === options.display;
						});

						if (!display)
						{
							this._reportError('INVALID_DISPLAY', 'Does not exists a display with the id: ' + options.display);
						}
						else
						{
							var url = this.current_view.translator.cloneForOption('display', options.display).getUrl();

							return this.current_view.setEvent('Display', options.display).then(function ()
							{
								Backbone.history.navigate(url, { trigger: true });
							});
						}
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}

				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

			// @method getPageSize Get the info of the active page size option
			// @return {Object} | NULL
		,	getPageSize: function getPageSize()
			{
				if (this._isViewFromComponent())
				{
					return this._getOption({ option: 'show', list_options: this.current_view.resultsPerPage });
				}
			}

			// @method getAllPageSize Get the info of all the page size option
			// @return {Array} | NULL
		,	getAllPageSize: function getAllPageSize()
			{
				if (this._isViewFromComponent())
				{
					return this._getAllOptions({ option: 'show', list_options: this.current_view.resultsPerPage });
				}
			}

			// @method setPageSize Set the page size option in the PLP
		,	setPageSize: function setPageSize(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						var pageSizes = this.current_view.resultsPerPage
						,	pageSize = _.find(pageSizes, function(pageSize)
						{
							return pageSize.id === options.pageSize;
						});

						if (!pageSize)
						{
							this._reportError('INVALID_PAGESIZE', 'Does not exists a page size with the value: ' + options.pageSize);
						}
						else
						{
							var url = this.current_view.translator.cloneForOption('show', options.pageSize).getUrl();

							return this.current_view.setEvent('PageSize', parseInt(options.pageSize, 10)).then(function ()
							{
								Backbone.history.navigate(url, { trigger: true });
							});
						}
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}
				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

			// @method getFilters Get the info of the active filters option
			// @return {Array} | NULL
		,	getFilters: function getFilters()
			{
				if (this._isViewFromComponent())
				{
					return Utils.deepCopy(this.current_view.translator.getAllFacets());
				}
			}

			// @method getAllFilters Get the info of all the filters
			// @return {Object} | NULL
		,	getAllFilters: function getAllFilters()
			{
				if (this._isViewFromComponent())
				{
					var exclude = _.map((this.current_view.$el.find('[data-view="Facets.FacetedNavigation"]').data('exclude-facets') || '').split(','), function (facet_id_to_exclude)
						{
							return jQuery.trim( facet_id_to_exclude );
						})
					,	facets = _.filter(this.current_view.model.get('facets'), function (facet)
						{
							return !_.contains(exclude, facet.id);
						});

					return Utils.deepCopy(facets);
				}
			}

			// @method setFilters Set the filters for the PLP
		,	setFilters: function setFilters(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						options = options || {};
						var filters = options.filters || {};

						var translator = this.current_view.translator.cloneWithoutFacets();

						_.each(filters, function(value, key)
						{
							var config = translator.getFacetConfig(key);

							translator.facets.push({
								config: config
							,	id: config.id
							,	url: config.id
							,	value: value
							,	isParameter: config.isParameter
							});
						});

						var url = translator.getUrl();

						return this.current_view.setEvent('Filters', filters).then(function ()
						{
							Backbone.history.navigate(url, { trigger: true });
						});
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}
				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

			// @method getSearchText Return the text that was search
			// @return {String} | NULL
		,	getSearchText: function getSearchText()
			{
				if (this._isViewFromComponent())
				{
					return this.current_view.translator.getOptionValue('keywords') || '';
				}
			}

			// @method setSearchText Not implemented
		,	setSearchText: function setSearchText(options)
			{
				try
				{
					if (this._isViewFromComponent())
					{
						var keywords = options.searchText || ''
						,	translatorOptions = {
								keywords: keywords
							,	show: parseInt(this.current_view.translator.getOptionValue('show'), 10)
							,	order: this.current_view.translator.getOptionValue('order')
							,	display: this.current_view.translator.getOptionValue('display')
							}
						,	translator = FacetsTranslator([], translatorOptions, this.current_view.translator.configuration, null)
						,	url = translator.getUrl();

						return this.current_view.setEvent('SearchText', keywords).then(function ()
						{
							Backbone.history.navigate(url, { trigger: true });
						});
					}
					else
					{
						return jQuery.Deferred().reject(false);
					}
				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

			// @method getItemsInfo Get the info of all the items in the PLP
			// @return {Array} | NULL
		,	getItemsInfo: function getItemsInfo()
			{
				if (this._isViewFromComponent())
				{
					return Utils.deepCopy(this.current_view.model.get('items'));
				}
			}

			// @method getCategoryInfo Get the info of the current Category
			// @return {Object} | NULL
		,	getCategoryInfo: function getCategoryInfo()
			{
				if (this._isViewFromComponent())
				{
					return Utils.deepCopy(this.current_view.model.get('category'));
				}
			}


			// {
			// 	"currentPage": 1,
			// 	"pageSize": 24,
			// 	"sorting": "relevance:asc",
			// 	"display": "grid",
			// 	"filters": { "urlcomponent": "value" },
			// 	"searchText": "",
			// 	"category": ""
			// }
			// @method getUrl Get the url to the Search API with the corresponding parameters
			// @return {String} | NULL
		,	getUrl: function getUrl(options)
			{
				if (this._isViewFromComponent())
				{
					var self = this
					,	defaultOptions = {
							currentPage: 1
						,	pageSize: _.find(this.getAllPageSize(), function(option) { return option.isDefault; }).id
						,	display: _.find(this.getAllDisplay(), function(option) { return option.isDefault; }).id
						,	sorting: _.find(this.getAllSorting(), function(option) { return option.isDefault; }).id
						,	searchText: ''
						};

					options = _.extend({}, defaultOptions, options);

					var currentTranslator = this.current_view.translator;
					var translatorOptions = {};

					translatorOptions.show = options.pageSize;
					translatorOptions.order = options.sorting;
					translatorOptions.page = options.currentPage;
					translatorOptions.display = options.display;
					translatorOptions.keywords = options.searchText;

					var filters = options.filters || [];
					var translatorFilters = [];

					_.each(filters, function(value, key)
					{
						var config = self.current_view.translator.getFacetConfig(key);

						translatorFilters.push({
							config: config
						,	id: config.id
						,	url: config.id
						,	value: value
						,	isParameter: config.isParameter
						});
					});

					var translator = new FacetsTranslator(translatorFilters, translatorOptions, currentTranslator.configuration, options.category)
					,	facetModel = new FacetsModel()
					,	data = translator.getApiParams() || {}
					,	url = facetModel.url();

					data.c = SC.ENVIRONMENT.companyId;
					data.n = SC.ENVIRONMENT.siteSettings.siteid;

					url += ((~url.indexOf('?')) ? '&' : '?') + jQuery.param(data);

					url = Utils.reorderUrlParams(url);

					return url;
				}
			}
		});

		var innerToOuterMap = [
			// @event beforeSetCurrentPage Cancelable event triggered before the page is set @public @extlayer
			{inner: 'before:FacetModel.setCurrentPage', outer: 'beforeSetCurrentPage', normalize: null}
			// @event afterSetCurrentPage Triggered after the page is set @public @extlayer
		,	{inner: 'after:FacetModel.setCurrentPage', outer: 'afterSetCurrentPage', normalize: null}
			// @event beforeSetSorting Cancelable event triggered before the sort is set @public @extlayer
		,	{inner: 'before:FacetModel.setSorting', outer: 'beforeSetSorting', normalize: null}
			// @event afterSetSorting Triggered after the sort is set @public @extlayer
		,	{inner: 'after:FacetModel.setSorting', outer: 'afterSetSorting', normalize: null}
			// @event beforeSetPageSize Cancelable event triggered before the page size is set @public @extlayer
		,	{inner: 'before:FacetModel.setPageSize', outer: 'beforeSetPageSize', normalize: null}
			// @event afterSetPageSize Triggered after the page size is set @public @extlayer
		,	{inner: 'after:FacetModel.setPageSize', outer: 'afterSetPageSize', normalize: null}
			// @event beforeSetDisplay Cancelable event triggered before the display is set @public @extlayer
		,	{inner: 'before:FacetModel.setDisplay', outer: 'beforeSetDisplay', normalize: null}
			// @event afterSetDisplay Triggered after the display is set @public @extlayer
		,	{inner: 'after:FacetModel.setDisplay', outer: 'afterSetDisplay', normalize: null}
			// @event beforeSetFilters Cancelable event triggered before the filters is set @public @extlayer
		,	{inner: 'before:FacetModel.setFilters', outer: 'beforeSetFilters', normalize: null}
			// @event afterSetFilters Triggered after the filters is set @public @extlayer
		,	{inner: 'after:FacetModel.setFilters', outer: 'afterSetFilters', normalize: null}
			// @event beforeSetSearchText Cancelable event triggered before the search text is set @public @extlayer
		,	{inner: 'before:FacetModel.setSearchText', outer: 'beforeSetSearchText', normalize: null}
			// @event afterSetSearchText Triggered after the search text is set @public @extlayer
		,	{inner: 'after:FacetModel.setSearchText', outer: 'afterSetSearchText', normalize: null}
		];

		application.getLayout().on('beforeAppendView', function onApplicationBeforeAppendView (view)
		{
			if (privateComponent._isViewFromComponent(view, true))
			{
				privateComponent._suscribeToInnerEvents(innerToOuterMap, view.model);
			}
		});

		return privateComponent;
	};
});
