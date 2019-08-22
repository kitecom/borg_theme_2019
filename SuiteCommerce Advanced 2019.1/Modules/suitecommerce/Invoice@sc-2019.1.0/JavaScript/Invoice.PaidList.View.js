/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Invoice
define('Invoice.PaidList.View'
,	[	'Transaction.List.View'
	, 'Invoice.Collection'
	,	'ListHeader.View'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'Profile.Model'
	,	'RecordViews.View'
	,	'Handlebars'
	,	'SC.Configuration'
	,	'AjaxRequestsKiller'

	,	'invoice_paid_list.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'

	,	'Utils'
	]
,	function (
	  TransactionListView
	,	InvoiceCollection
	,	ListHeaderView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	ProfileModel
	,	RecordViewsView
	,	Handlebars
	,	Configuration
	,	AjaxRequestsKiller

	,	invoice_paid_list_tpl

	,	jQuery
	,	Backbone
	,	_

	)
{
	'use strict';
	//@class Invoice.PaidList.View @extends Backbone.View
	return TransactionListView.extend({
		//@property {Function} template
		template: invoice_paid_list_tpl
		//@property {String} title
	,	title: _('Invoices').translate()
		//@property {String} page_header
	,	page_header: _('Invoices').translate()
		//@property {Object} attributes
	,	attributes: {
			'id': 'PaidInvoicesHistory'
		,	'class': 'PaidInvoices'
		}
		//@method initialize
	,	initialize: function (options)
		{
			this.collection = new InvoiceCollection();

			this.collection.on('sync', this.showContent, this)

			this.user = ProfileModel.getInstance();

			var today = new Date()
			,	isoDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

			this.rangeFilterOptions = {
				fromMin: '1800-01-02'
			,	fromMax: isoDate
			,	toMin: '1800-01-02'
			,	toMax: isoDate
			};

			// manages sorting and filtering of the collection
			this.listHeader = new ListHeaderView({
				view: this
			,	application : options.application
			,	collection: this.collection
			,	sorts: this.sortOptions
			,	rangeFilter: 'date'
			,	rangeFilterLabel: _('From').translate()
			});

			this.collection.on('sync reset', jQuery.proxy(this, 'render'));
		}

	,	beforeShowContent: function beforeShowContent()
		{
			return this.collection.fetch({
					data: {
						status: 'paid'
					,	page: 'all'
					}
				,	killerId: AjaxRequestsKiller.getKillerId()
				});
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'invoices';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/paid-invoices'
			};
		}
		//@property {Array} sortOptions
		// Array of default sort options
		// sorts only apply on the current collection
		// which might be a filtered version of the original
	,	sortOptions: [
			{
				value: 'closedate'
			,	name: _('By Close Date').translate()
			,	selected: true
			,	sort: function ()
				{
					return this.sortBy(function (invoice)
					{
						return [invoice.get('closedateInMilliseconds'), invoice.get('tranid')];
					});
				}
			}
		,	{
				value: 'trandate'
			,	name: _('By Invoice Date').translate()
			,	sort: function ()
				{
					return this.sortBy(function (invoice)
					{
						return [invoice.get('tranDateInMilliseconds'), invoice.get('tranid')];
					});
				}
			}
		,	{
				value: 'invoicenumber'
			,	name: _('By Invoice Number').translate()
			,	sort: function ()
				{
					return this.sortBy(function (invoice)
					{
						return parseInt(invoice.get('tranid').split(/[^\(\)0-9]*/).join(''), 10);
					});
				}
			}
		,	{
				value: 'amountdue'
			,	name: _('By Amount').translate()
			,	sort: function ()
				{
					return this.sortBy(function (invoice)
					{
						return invoice.get('amount');
					});
				}
			}
		]
		//@property {Object} childViews
	,	childViews: {
				'ListHeader': function ()
				{
					return this.listHeader;
				}
			,	'Invoice.Results': function ()
				{
					return this._resultsView;
				}	
		}
	, _buildResultsView: function() {
			var self = this;
			var selectedColumns = [];

			if(!Configuration.get().transactionListColumns.enableInvoice) {
				selectedColumns.push({label: 'Date:', type: 'date', name:'date', id: 'trandate'});
				selectedColumns.push({label: 'Close Date:', type: 'date', name:'close-date', id:'closedate'});
				selectedColumns.push({label: 'Amount:', type:'currency', name:'amount', id: 'amount_formatted'});
			} else {
				selectedColumns = Configuration.get().transactionListColumns.invoicePaid;
			}

			var records_collection = new Backbone.Collection(this.collection.map(function (invoice)
			{
				var model = new Backbone.Model({
					touchpoint: 'customercenter'
				,	title: new Handlebars.SafeString(_('Invoice #<span class="tranid">$(0)</span>').translate(invoice.get('tranid')))
				,	detailsURL: 'invoices/' + invoice.get('internalid')

				,	id: invoice.get('internalid')
				,	internalid: invoice.get('internalid')

				,	columns: self._buildColumns(selectedColumns, invoice)
				});

				return model;
			}));

			return new BackboneCollectionView({
				childView: RecordViewsView
			,	collection: records_collection
			,	viewsPerRow: 1
			,	childViewOptions: {
					referrer: 'paid-invoices'
				}
			});
		
	}	
		//@method getContext @returns Invoice.PaidList.View.Context
	,	getContext: function ()
		{	
			this._resultsView = this._buildResultsView();
			var columns = [];
			if (this._resultsView.collection.length > 0)
			{
				columns = this._resultsView.collection.at(0).get('columns');
			}
			//@class Invoice.PaidList.View.Context
			return {
					//@property {Invoice.Collection} invoices
					invoices: this.collection
					//@property {Boolean} showInvoices
				,	showInvoices: !!this.collection.length
					//@property {String} pageHeader
				,	pageHeader: this.page_header
					//@property {Boolean} showBackToAccount
				,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
					//@property {Array<{}>} columns
				, columns: columns
			};
		}
	});
});
