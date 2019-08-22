/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Quote
define(
	'Quote.List.View'
,	[
		'Transaction.List.View'
	,	'ListHeader.View'
	,	'Quote.ListExpirationDate.View'
	,	'Quote.Collection'
	,	'RecordViews.View'
	,	'SC.Configuration'

	,	'quote_list.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'

	,	'Utils'
	]
,	function (
		TransactionListView
	,	ListHeaderView
	,	QuoteListExpirationDateView
	,	QuoteCollection
	,	RecordViewsView
	,	Configuration

	,	quote_list_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	_
	)
{
	'use strict';

	// @class Quote.List.View @extends Backbone.View
	return TransactionListView.extend({

		//@property {Function} template
		template: quote_list_tpl

		//@property {String} className
	,	className: 'QuoteListView'

		//@property {String} title
	,	title: _('Quotes').translate()

		//@property {String} page_header
	,	page_header: _('Quotes').translate()

		//@property {Object} attributes
	,	attributes: {
			'id': 'QuotesHistory'
		,	'class': 'QuoteListView'
		}

		//@method initialize
		//@param {application:AplpicationSkeleton} options
		//@return {Void}
	,	initialize: function (options)
		{
			this.application = options.application;
			this.collection = new QuoteCollection();

			this.listenCollection();
			this.setupListHeader();
			this.collection.on('reset', this.showContent, this);
		}

		//@method listenCollection Attaches to the current collection events request and reset to indicate if it is loading data or not
		//@return {Void}
	,	listenCollection: function ()
		{
			this.setLoading(true);

			this.collection.on({
				request: _.bind(this.setLoading, this, true)
			,	reset: _.bind(this.setLoading, this, false)
			});
		}

		//@method setupListHeader Initialize the list header component
		//@return {Void}
	,	setupListHeader: function ()
		{
			// manges sorting and filtering of the collection
			this.listHeader = new ListHeaderView({
				view: this
			,	application: this.application
			,	collection: this.collection
			,	filters: this.filterOptions
			,	sorts: this.sortOptions
			,   allowEmptyBoundaries: true
			});
		}

		//@method setLoading Set the loading status of the current view
		//@param {Boolean} is_loading
		//@return {Void}
	,	setLoading: function (is_loading)
		{
			//@property {Boolean} isLoading
			this.isLoading = is_loading;
		}

		//@property {Array<ListHeader.View.FilterOption>} filterOptions
	,	filterOptions: [
			{
				value: 'ALL'
			,	name: _('Show all statuses').translate()
			,	selected: true
			}
		,	{
				value: '14'
			,	name: _('Closed Lost').translate()
			}
		,	{
				value: '8'
			,	name: _('In Discussion').translate()
			}
		,	{
				value: '9'
			,	name: _('Identified Decision Makers').translate()
			}
		,	{
				value: '10'
			,	name: _('Proposal').translate()
			}
		,	{
				value: '11'
			,	name: _('In Negotiation').translate()
			}
		,	{
				value: '12'
			,	name: _('Purchasing').translate()
			}
		]

		//@property {Array<ListHeader.View.SortOption>} sortOptions
	,	sortOptions: [
			{
				value: 'tranid'
			,	name: _('by Number').translate()
			,	selected: true
			}
		,	{
				value: 'trandate'
			,	name: _('by Request date').translate()
			}
		,	{
				value: 'duedate'
			,	name: _('by Expiration date').translate()
			}
		,	{
				value: 'total'
			,	name: _('by Amount').translate()
			}
		]

		//@method getSelectedMenu Indicates what my account menu is selected when this view is being rendered
		//@return {String}
	,	getSelectedMenu: function ()
		{
			return 'quotes';
		}

		//@method getBreadcrumbPages
		//@return {BreadcrumbPage}
	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/quotes'
			};
		}

		//@property {ChildViews} childViews
	,	childViews: {
			'Quote.List.Items': function ()
			{
				return this._resultsView;
			}
		,	'List.Header': function ()
			{
				return this.listHeader;
			}
		}
		, _buildResultsView: function () {
			var self = this;
			

			
			
			var records_collection = new Backbone.Collection(this.collection.map(function (quote) {
				
				var quote_internalid = quote.get('internalid');
				var selectedColumns = [];
				
				if(!Configuration.get().transactionListColumns.enableQuote) 
				{
					selectedColumns.push({label:'Request date:', type:'request-date', name:'request-date', id:'trandate'});
					selectedColumns.push({label:'Amount:', type:'currency', name:'amount-date', id:'total_formatted'});
					selectedColumns.push({label:'Expiration date:', type:'expiration-date', name:'expiration-date', compositeKey:'QuoteListExpirationDateView', composite:'Quote.ListExpirationDate.View'})
					selectedColumns.push({label:'Status:', type:'status', name:'status', id:'status'})
				} else {
					selectedColumns = Configuration.get().transactionListColumns.quote;
				}
			
				return new Backbone.Model({
					touchpoint: 'customercenter'

					, title: _('Quote #$(0)').translate(quote.get('tranid'))
					, detailsURL: '#/quotes/' + quote_internalid

					, id: quote_internalid
					, internalid: quote_internalid

					, columns: self._buildColumns(selectedColumns, quote)
				});
			}));

			return new BackboneCollectionView({
				childView: RecordViewsView
				, collection: records_collection
				, viewsPerRow: 1
			});
		}	

		//@method destroy Override default method to  from collection events
		//@return {Void}
	,	destroy: function ()
		{
			this.collection.off('request reset');

			Backbone.View.prototype.destroy.apply(this, arguments);
		}

		// @method getContext
		// @return {Quote.List.View.Context}
	,	getContext: function()
		{
			this._resultsView = this._buildResultsView();
			var columns = [];
			if (this._resultsView.collection.length > 0)
			{
				columns = this._resultsView.collection.at(0).get('columns');
			}
			// @class Quote.List.View.Context
			return {
				// @property {String} pageHeader
				pageHeader: this.page_header
				// @property {Array} collection
			,	collection: this.collection
				// @property {Boolean} collectionLength
			,	collectionLength: this.collection.length
				// @property {Boolean} isLoading
			,	isLoading: this.isLoading
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
				//@property {Array<{}>} columns
			, columns: columns
			};
			// @class Quote.List.View
		}
	});
});