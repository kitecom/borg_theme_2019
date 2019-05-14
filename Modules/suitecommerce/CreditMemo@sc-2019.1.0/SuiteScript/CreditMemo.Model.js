/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module CreditMemo
define('CreditMemo.Model'
,	[	'Transaction.Model'
	,	'StoreItem.Model'
	,	'Application'
	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionModel
	,	StoreItem
	,	Application
	,	_
	,	Utils
	)
{
	'use strict';

	//@class CreditMemo.Model @extend TransactionModel
	return TransactionModel.extend({
		name: 'CreditMemo'

	,	getInvoices: function()
		{
			this.result.invoices = [];

			for (var i = 1; i <= this.record.getLineItemCount('apply'); i++)
			{
				var invoice = {
						line: i
					,	internalid: this.record.getLineItemValue('apply', 'internalid', i)
					,	type: this.record.getLineItemValue('apply', 'type', i)
					,	total: Utils.toCurrency(this.record.getLineItemValue('apply', 'total', i))
					,	total_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'total', i), this.currencySymbol)
					,	apply: this.record.getLineItemValue('apply', 'apply', i) === 'T'
					,	applydate: this.record.getLineItemValue('apply', 'applydate', i)
					,	currency: this.record.getLineItemValue('apply', 'currency', i)
					,	amount: Utils.toCurrency(this.record.getLineItemValue('apply', 'amount', i))
					,	amount_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'amount', i), this.currencySymbol)
					,	due: Utils.toCurrency(this.record.getLineItemValue('apply', 'due', i))
					,	due_formatted: Utils.formatCurrency(this.record.getLineItemValue('apply', 'due', i), this.currencySymbol)
					,	refnum: this.record.getLineItemValue('apply', 'refnum', i)
				};

				this.result.invoices.push(invoice);
			}
		}

	,	getExtraRecordFields: function ()
		{
			if (this.result && this.result.selected_currency) 
			{
				this.currencySymbol = this.result.selected_currency.symbol;
			}	

			this.result.amountpaid = Utils.toCurrency(this.record.getFieldValue('amountpaid'));
			this.result.amountpaid_formatted = Utils.formatCurrency(this.record.getFieldValue('amountpaid'), this.currencySymbol);
			this.result.amountremaining = Utils.toCurrency(this.record.getFieldValue('amountremaining'));
			this.result.amountremaining_formatted = Utils.formatCurrency(this.record.getFieldValue('amountremaining'), this.currencySymbol);

			this.getInvoices();
		}
	});
});