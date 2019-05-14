/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Invoice
define('Invoice.Details.View'
,	[	'LivePayment.Model'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'Address.Details.View'
	,	'Transaction.Line.Views.Cell.Navigable.View'
	,	'Invoice.Model'

	,	'invoice_details.tpl'

	,	'Backbone'
	,	'underscore'
	,   'ReturnAuthorization.GetReturnableLines'
 	,	'OrderHistory.Model'
 	,   'AjaxRequestsKiller'
	,   'jQuery'
	]
, 	function (
		LivePaymentModel
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	AddressDetailsView
	,	TransactionLineViewsCellNavigableView
	,	InvoiceModel

	,	invoice_details_tpl

	,	Backbone
	,	_
	,   ReturnLinesCalculator
	,   OrderHistoryModel
	,   AjaxRequestsKiller
	,   JQuery
	)
{
	'use strict';
	//@class Invoice.Details.View @extends Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: invoice_details_tpl

	,	title: _('Invoice Details').translate()

		//@property {Object} events
	,	events: {
			'click [data-type="make-a-payment"]' : 'makeAPayment'
		}

	,	attributes: {
			'id': 'InvoiceDetail'
		,	'class': 'InvoiceDetail'
		}

		//@method initialize
	,   initialize: function (options)
		{
			var self = this
			,	internalid = options.routerArguments[0];

			this.model = new InvoiceModel({ internalid: internalid });

	 		if (Backbone.history.fragment.indexOf('transactionhistory/invoices/') === 0)
			{
				this.options.referrer = 'transactionhistory';

				this.model.on('change', this.showContent, this)
			}
			else
			{
				if (options.routerArguments.length > 1)
				{
					this.options.referrer = options.routerArguments[1];
				}
			}

			this.application = options.application;
			this.navSource = this.getNavSource(this.options.referrer);
 	 		this.validLines = 0;
			this.livePaymentModel = LivePaymentModel.getInstance();
		}

	,	beforeShowContent: function beforeShowContent()
		{
			var self = this;

			if (Backbone.history.fragment.indexOf('transactionhistory/invoices/') === 0)
			{
				return this.model.fetch({
					killerId: AjaxRequestsKiller.getKillerId()
				});

		}
			else
			{
				return this.model.fetch({
						killerId: AjaxRequestsKiller.getKillerId()
					}).then(function()
					{
						return self.isReturnable();
			 		});
			}
		}

		//@method getNavSource Define the object that will be used by the breadcrumb
		//@param {String} referrer Option defined to record the navigation origin
		//@return {Invoice.Details.View.navSource}
	,	getNavSource: function (referrer)
		{
			var navSource = {};

			switch (referrer)
			{
				case 'paid-invoices' :
					navSource.href = '/paid-invoices';
					navSource.text = _('Invoices').translate();
					navSource.menu = 'invoices';
					break;
				case 'transactionhistory' :
					navSource.href = '/transactionhistory';
					navSource.text = _('Transaction History').translate();
					navSource.menu = 'transactionhistory';
					break;
				default :
					navSource.href = '/invoices';
					navSource.text = _('Invoices').translate();
					navSource.menu = 'invoices';
					break;
			}

			return navSource;
		}

		//@method getSelectedMenu Define the name of the menu option selected when displaying this view
		//@return {String}
	,	getSelectedMenu: function ()
		{
			return this.navSource && this.navSource.menu || 'invoices';
		}

		//@method getBreadcrumbPages Define the content of the breadcrumb
		//@return {Array}
	,	getBreadcrumbPages: function ()
		{

			return [
				{
					text: this.navSource.text
				,	href: this.navSource.href
				}
			,	{
					text: _('Invoice #$(0)').translate(this.model.get('tranid'))
				,	href: '/invoices/view/' + this.model.get('internalid')
			}];
		}

		//@method getItemsNumber
	,	getItemsNumber: function()
		{
			var items_quantity = 0;
			this.model.get('lines').each(function (models)
			{
				items_quantity += models.get('quantity');
			});

			return items_quantity;
		}

		//@method makeAPayment Mark the current invoice as selected (check) and start the payment wizard
	,	makeAPayment: function ()
		{
			if (this.model.get('currency')) 
			{
				var currency = this.model.get('currency').internalid;

				this.livePaymentModel.changeCurrency(currency);
			}

			LivePaymentModel.getInstance().selectInvoice(this.model.id);
		}
		
	 	//@method isReturnable Calculate based on the fulfillments and returns made, if the invoice accepts returns
	,	isReturnable: function ()
		{
	 		var deferred = JQuery.Deferred()
			,	self = this
			,	model = new OrderHistoryModel();

	 		model
	 			.fetch({
	  				data: {
	 					internalid: this.model.get('createdfrom').internalid
	 				,   recordtype: this.model.get('createdfrom').recordtype
	 				}
	 				,	killerId: AjaxRequestsKiller.getKillerId()
	 			})
	 			.done(function() {
	 				var returnable_calculator = new ReturnLinesCalculator(model, {notConsiderFulfillments: true});
					self.validLines = returnable_calculator.calculateLines().validLines.length;
	 	                                                
	 				deferred.resolve();
	 			});
	 
	 			return deferred.promise();
		}
			
		//@property {Object} childViews
	,	childViews: {
				'Billing.Address': function ()
				{
					return new AddressDetailsView({
							model: this.model.get('addresses').get(this.model.get('billaddress'))
						,	hideDefaults: true
						,	showSelect: false
						,	hideActions: true
						,	hideSelector: true
					});
				}

			,	'Items.Collection': function ()
				{
					return new BackboneCollectionView({
							collection: this.model.get('lines')
						,	childView: TransactionLineViewsCellNavigableView
						,	viewsPerRow: 1
						,	childViewOptions: {
								navigable: true

							,	detail1Title: _('Qty:').translate()
							,	detail1: 'quantity'

							,	detail2Title: _('Unit price:').translate()
							,	detail2: 'rate_formatted'

							,	detail3Title: _('Amount:').translate()
							,	detail3: 'total_formatted'
							}
					});
				}
		}

		//@method getContext @returns Invoice.Details.View.Context
	,	getContext: function ()
		{
			var payments = this.model.get('adjustments').where({recordtype: 'customerpayment'})
			,	credit_memos = this.model.get('adjustments').where({recordtype: 'creditmemo'})
			,	deposit_applications = this.model.get('adjustments').where({recordtype: 'depositapplication'})
			,	show_adjustments = this.model.get('adjustments').length
			,	is_open = this.model.get('status').internalid === 'open'
			,	paymentmethod = this.model.get('paymentmethods') && this.model.get('paymentmethods').findWhere({primary: true})
			,	lines = this.model.get('lines')
			,	items_quantity = this.getItemsNumber()
			,	self = this;

			payments = _.map(payments, function (payment)
			{
				return { 
					tranid: payment.tranid
				,	trandate: payment.trandate
				,	internalid: payment.internalid
				,	amount: payment.amount
				,	amount_formatted: _.formatCurrency(payment.amount, self.model.get('selected_currency').symbol) };
			});

			//@class Invoice.Details.View.Context
			return {
					//@property {Invoice.Model} model
					model: this.model
					//@property {String} makeAPaymentPermissions
				,	makeAPaymentPermissions: 'transactions.tranCustPymt.2, transactions.tranCustInvc.1'
					//@property {Boolean} showInModal
				,	showInModal: !!this.inModal
					//@property {String} donwloadPdfUrl
				,	donwloadPdfUrl: _.getDownloadPdfUrl({asset:'invoice-details', 'id': this.model.get('internalid')})
					//@property {String} pageTitle
				,	pageTitle: _('Invoice <span class="strong-text">#$(0)</span>').translate(this.model.get('order_number'))
					//@property {Boolean} isOpen
				,	isOpen: is_open
					//@property {Boolean} showCreatedFrom
				,	showCreatedFrom: !!(this.model.get('createdfrom') && this.model.get('createdfrom').internalid)
					//@property {Boolean} showDueDate
				,	showDueDate: !!this.model.get('dueDate')
					//@property {Boolean} showSaleRep
				,	showSaleRep: !!this.model.get('salesrep')
					//@property {Boolean} showSaleRepPhone
				,	showSaleRepPhone: !!(this.model.get('salesrep') && this.model.get('salesrep').phone)
					//@property {Boolean} showSaleRepName
				,	showSaleRepEmail: !!(this.model.get('salesrep') && this.model.get('salesrep').email)
					//@property {String} siteName
				,	siteName: this.application.getConfig('siteSettings.displayname')
					//@property {Boolean} showMemo
				,	showMemo: !!this.model.get('memo')
					//@property {Boolean} showTerms
				,	showTerms: !!(paymentmethod && paymentmethod.get('paymentterms'))
					//@property {String} termsName
				,	termsName: paymentmethod && paymentmethod.get('paymentterms') && paymentmethod.get('paymentterms').name || ''
					//@property {Boolean} showDiscountSummary
				,	showDiscountSummary: !!this.model.get('summary').discounttotal
					//@property {Boolean} showGiftcerticate
				,	showGiftcerticate: !!this.model.get('summary').giftcertapplied
					//@property {Boolean} showAdjustments
				,	showAdjustments: show_adjustments
					//@property {Boolean}
				,	showMakeAPaymentButton: !!(is_open && !this.inModal)
					//@property {Boolean} showBillingAddress
				,	showBillingAddress: !!this.model.get('addresses').get(this.model.get('billaddress'))
					//@property {Array} payments
				,	payments: payments
					//property {Boolean} showPayments
				,	showPayments: !!payments.length
					//@property {Array} payments
				,	creditMemos: credit_memos
					//property {Boolean} showCreditMemos
				,	showCreditMemos: !!credit_memos.length
					//@property {Array} depositApplications
				,	depositApplications: deposit_applications
					//property {Boolean} showCreditMemos
				,	showDepositApplications: !!deposit_applications.length
					//@property {Boolean} showLines
				,	showLines: !!lines.length
					//@property {Boolean} linesLengthGreaterThan1
				,	linesLengthGreaterThan1: lines.length > 1
					//@property {Number} itemsQuantityNumber
				,	itemsQuantityNumber: items_quantity
					//@property {Boolean} linesitemsNumberGreaterThan1
				,	linesitemsNumberGreaterThan1: items_quantity > 1
					//@property {OrderLine.Collection} lines
				,	lines: lines
					//@property {Boolean} showOpenedAccordion
				,	showOpenedAccordion:  _.isTabletDevice() || _.isDesktopDevice()
				    //@property {Boolean} showRequestReturnButton
				,   showRequestReturnButton: !!this.validLines
			};
		}
	});
});
