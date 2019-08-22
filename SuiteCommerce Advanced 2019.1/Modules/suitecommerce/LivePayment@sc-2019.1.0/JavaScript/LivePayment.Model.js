/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module LivePayment
define('LivePayment.Model'
,	[	'Invoice.Collection'
	,	'PaymentWizard.CreditTransaction.Collection'
	,	'Address.Collection'
	,	'Transaction.Paymentmethod.Collection'
	,	'Profile.Model'
	,	'Transaction.Model'
	,	'Singleton'
	,	'bignumber'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	,	'jQuery'
	]
,	function (
		InvoiceCollection
	,	CreditTransactionCollection
	,	AddressesCollection
	,	TransactionPaymentmethodCollection
	,	ProfileModel
	,	TransactionModel
	,	Singleton
	,	BigNumber
	,	_
	,	Backbone
	,	Utils
	,	JQuery
	)
{
	'use strict';

	// @class LivePayment.Model Is singleton. @extends Backbone.Model
	return Backbone.Model.extend({

		urlRoot: 'services/LivePayment.Service.ss'

	,	initialize: function (attributes)
		{
			this.set('invoices_total', 0);

			this.on('sync', function (model)
			{
				model.set('invoices_total', 0);
			});

			this.on('change:addresses', function (model, addresses)
			{
				model.set('addresses', new AddressesCollection(addresses), {silent: true});
			});
			this.trigger('change:addresses', this, attributes && attributes.addresses || []);

			this.on('change:paymentmethods', function (model, paymentmethods)
			{
				model.set('paymentmethods', new TransactionPaymentmethodCollection(paymentmethods), {silent: true});
			});
			this.trigger('change:paymentmethods', this, attributes && attributes.paymentmethod || []);

			this.on('change:invoices', function (model, invoices)
			{
				model.set('invoices', new InvoiceCollection(invoices), {silent: true});
			});
			this.trigger('change:invoices', this, attributes && attributes.invoices || []);

			this.on('change:deposits', function (model, deposits)
			{
				model.set('deposits', new CreditTransactionCollection(deposits), {silent: true});
			});
			this.trigger('change:deposits', this, attributes && attributes.deposits || []);

			this.on('change:credits', function (model, credits)
			{
				model.set('credits', new CreditTransactionCollection(credits), {silent: true});
			});
			this.trigger('change:credits', this, attributes && attributes.credits || []);

			this.on('change:balance', function (model)
			{
				var profile_model = ProfileModel.getInstance();
				profile_model.set('balance', model.get('balance'));
				profile_model.set('balance_formatted', model.get('balance_formatted'));
			});

			this.currency = this.getCurrency();
			if (this.currency) 
			{
				this.currencySymbol = this.currency.symbol;
			}			
		}

		// @method getSelectedInvoices @return {Invoice.Collection}
	,	getSelectedInvoices: function ()
		{
			return new InvoiceCollection(this.get('invoices').filter(function (invoice)
			{
				return invoice.get('apply');
			}));
		}

		// @method getCurrency @return {Currency}
	,	getCurrency: function ()
		{
			var invoices = this.get('invoices')
			,	currencyName;	

			if (invoices.length) 
			{
				currencyName = invoices.first().get('currency');
			}
		
			return _.getCurrencyByName(currencyName);
		}	

		// @method getAppliedTransactions @return  {PaymentWizard.CreditTransaction.Collection}
	,	getAppliedTransactions: function (type)
		{
			return new CreditTransactionCollection(this.get(type).filter(function (transaction)
			{
				return transaction.get('apply');
			}));
		}

		// @method selectInvoice @param {Invoice.Model}
	,	selectInvoice: function (invoice)
		{
			this.currency = this.getCurrency();
			if (this.currency) 
			{
				this.currencySymbol = this.currency.symbol;
			}

			invoice = this.get('invoices').get(invoice);

			if (invoice && invoice.get('due'))
			{
				// marks the invoice as checked
				invoice.set('apply', true);
				invoice.set('checked', true);
				var amount =  invoice.get('due') ? invoice.get('due') : invoice.get('amount');
				invoice.set('amount', amount);
				invoice.set('amount_formatted', _.formatCurrency(amount, this.currencySymbol));
			}

			return this.distributeCredits();
		}

		// @method unselectInvoice @param {Invoice.Model}
	,	unselectInvoice: function (invoice)
		{
			this.currency = this.getCurrency();
			if (this.currency) 
			{
				this.currencySymbol = this.currency.symbol;
			}

			invoice = this.get('invoices').get(invoice);

			if (invoice)
			{
				invoice.set('apply', false);
				invoice.set('checked', false);
			}

			return this.distributeCredits();
		}

		// @method selectCredit @param {PaymentWizard.CreditTransaction.Model} credit
	,	selectCredit: function (credit)
		{
			credit = this.get('credits').get(credit);

			if (credit && credit.get('remaining'))
			{
				// marks the credit as checked
				credit.set('apply', true);

				var amount = new BigNumber(credit.get('remaining')).minus(this.get('payment')).toNumber();

				if (this.isAmountValid(amount))
				{
					amount = new BigNumber(credit.get('remaining')).minus(amount).toNumber();
				}
				else
				{
					amount = credit.get('remaining');
				}

				credit.set('amount', amount);
				credit.set('amount_formatted', _.formatCurrency(amount, this.currencySymbol));							
			}

			return this.calculeTotal();
		}

		// @method selectDeposit @param {PaymentWizard.CreditTransaction.Model} deposit
	,	selectDeposit: function (deposit)
		{
			deposit = this.get('deposits').get(deposit);

			if (deposit && deposit.get('remaining'))
			{
				// marks the credit as checked
				deposit.set('apply', true);

				var amount = new BigNumber(deposit.get('remaining')).minus(this.get('payment')).toNumber();

				if (this.isAmountValid(amount))
				{
					amount = new BigNumber(deposit.get('remaining')).minus(amount).toNumber();
				}
				else
				{
					amount = deposit.get('remaining');
				}

				deposit.set('amount', amount);
				deposit.set('amount_formatted', _.formatCurrency(amount, this.currencySymbol));
			}

			return this.calculeTotal();
		}

		// @method unselectCredit @param {PaymentWizard.CreditTransaction.Model} credit
	,	unselectCredit: function (credit)
		{
			credit = this.get('credits').get(credit);

			if (credit)
			{
				credit.set('apply', false);
				credit.set('amount', 0);
				credit.set('amount_formatted', _.formatCurrency(0, this.currencySymbol));							
			}

			return this.calculeTotal();
		}

		// @method unselectDeposit @param {PaymentWizard.CreditTransaction.Model} deposit
	,	unselectDeposit: function (deposit)
		{
			deposit = this.get('deposits').get(deposit);

			if (deposit)
			{
				deposit.set('apply', false);
				deposit.set('amount', 0);
				deposit.set('amount_formatted', _.formatCurrency(0, this.currencySymbol));
			}

			return this.calculeTotal();
		}

		// @method normalizeDate @param {Date} date @return {Date|Number}
	,	normalizeDate: function (date)
		{
			if (!date)
			{
				return;
			}
			else if (date instanceof Date)
			{
				return date.getTime();
			}
			else if (typeof date === 'string')
			{
				return Date.parse(date);
			}
			else if (typeof date === 'number')
			{
				return date;
			}
		}

		// @method isAmountValid @param {Int} amount @return {Boolean}
	,	isAmountValid: function isAmountValid(amount)
	{
		return new BigNumber(amount).isGreaterThan(0);
	}
		// Distributes deposits, payments and credit memos

		// @method distributeCredits
	,	distributeCredits: function ()
		{
			// First thing is to order everything by date and initialize parameters
			var	self = this
			,	invoices = new InvoiceCollection(this.getSelectedInvoices().sortBy(function (invoice)
				{
					return self.normalizeDate(invoice.get('duedate'));
				}))
			,	deposits = this.get('deposits').models
			,	credits = this.get('credits').models
			,	invoices_total = 0;

			invoices.each(function (invoice)
			{
				invoices_total = new BigNumber(invoices_total).plus(invoice.get('amount')).toNumber();
			});
			

			//Then apply remaining deposits to complete and try to apply credit memo and payments.
			var PaymentCollections = deposits.concat(credits);

			_.each(PaymentCollections, function (value)
			{
				if (self.isAmountValid(value.get('remaining')) && self.isAmountValid(invoices_total))
				{

					var amount = new BigNumber(invoices_total).isGreaterThanOrEqualTo(value.get('remaining')) ? value.get('remaining') : invoices_total;

					value.set('apply', true);
					value.set('amount', amount);
					value.set('amount_formatted', _.formatCurrency(amount, self.currencySymbol));

					invoices_total = new BigNumber(invoices_total).minus(amount).toNumber();
				}
				else
				{
					value.set('apply', false);
					value.set('amount', 0);
					value.set('amount_formatted', _.formatCurrency(0, self.currencySymbol));
				}
			});
				



			this.calculeTotal();
		}

		// @method calculeTotal @param {Boolean} silent
	,	calculeTotal: function (silent)
		{
			var invoices_total = 0
			,	payment_total = 0
			,	deposits_total = 0
			,	credits_total = 0
			,	self = this
			,	invoices = new InvoiceCollection(this.getSelectedInvoices().sortBy(function (invoice)
				{
					return self.normalizeDate(invoice.get('duedate'));
				}))
			,	deposits = this.get('deposits')
			,	credits = this.get('credits');

			invoices.each(function (invoice)
			{
				invoices_total = new BigNumber(invoices_total).plus(invoice.get('amount')).toNumber();
			});

			payment_total = invoices_total;

			deposits.each(function (deposit)
			{
				deposits_total = new BigNumber(deposits_total).plus(deposit.get('amount')).toNumber();
				payment_total = new BigNumber(payment_total).minus(deposit.get('amount')).toNumber();
			});

			credits.each(function (credit)
			{
				credits_total = new BigNumber(credits_total).plus(credit.get('amount')).toNumber();
				payment_total = new BigNumber(payment_total).minus(credit.get('amount')).toNumber();
			});

			if (!silent)
			{
				this.set('invoices_total_formatted', _.formatCurrency(invoices_total, this.currencySymbol));
				this.set('deposits_total_formatted', _.formatCurrency(new BigNumber(deposits_total).negated().toNumber(), this.currencySymbol));
				this.set('credits_total_formatted', _.formatCurrency(new BigNumber(credits_total).negated().toNumber(), this.currencySymbol));
				this.set('payment_formatted', _.formatCurrency(payment_total, this.currencySymbol));				
				this.set('currency_symbol', this.currencySymbol);
				this.set('invoices_total', invoices_total);
				this.set('deposits_total', deposits_total);
				this.set('credits_total', credits_total);				
				this.set('payment', payment_total);

				if (this.currency) 
				{
					this.set('currency_id', this.currency.internalid);
				}
			}

			return payment_total;
		}

	,	addPayment: function addPayment (payment_method)
		{
			// Gets the payment method collection
            var payment_methods = this.get('paymentmethods');

            // Removes the primary if any
            payment_methods.remove(
                payment_methods.where({primary: true})
            );

            // Sets it as primary
            payment_method.set('primary', true);

            // Adds it to the collection
            payment_methods.add(payment_method);
		}

	, 	changeCurrency: function (currency)
		{
			var self = this;

			JQuery.ajax({
				url: Utils.getAbsoluteUrl(self.urlRoot + '?cur=' + currency),
				success: function (data) 
				{
					self.set(data);					
				},
				async: false
			});
		}

	}, Singleton);
});
