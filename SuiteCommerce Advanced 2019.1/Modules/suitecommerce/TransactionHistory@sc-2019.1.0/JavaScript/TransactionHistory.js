/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module TransactionHistory Defines the TransactionHistory module (Model, Collection, Views, Router)
define('TransactionHistory'
,	[
		'TransactionHistory.List.View'
	,	'CreditMemo.Details.View'
	,	'DepositApplication.Details.View'
	,	'Deposit.Details.View'
	,	'CustomerPayment.Details.View'
	,	'Receipt.Details.View'
	,	'Invoice.Details.View'

	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionHistoryListView
	,	CreditMemoDetailsView
	,	DepositApplicationDetailsView
	,	DepositDetailsView
	,	CustomerPaymentDetailsView
	,	ReceiptDetailsView
	,	InvoiceDetailsView

	,	_
	,	Utils
	)
{
	'use strict';

	//@class TransactionHistory @extends ApplicationModule
	return	{
		MenuItems: {
			parent: 'billing'
		,	id: 'transactionhistory'
		,	name: _('Transaction History').translate()
		,	url: 'transactionhistory'
		,	permissionOperator: 'OR'
		,	permission: 'transactions.tranCustInvc.1, transactions.tranCustCred.1, transactions.tranCustPymt.1, transactions.tranCustDep.1, transactions.tranDepAppl.1'
		,	index: 3
		}

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'TransactionHistory'
			,	'routes': ['transactionhistory', 'transactionhistory?:options']
			,	'view': TransactionHistoryListView
			,	'defaultTemplate': {
					'name': 'transaction_history_list.tpl'
				,	'displayName': 'Transaction History Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-list.png')
				}
			});

			pageType.registerPageType({
				'name': 'CreditMemoDetail'
			,	'routes': ['transactionhistory/creditmemo/:id']
			,	'view': CreditMemoDetailsView
			,	'defaultTemplate': {
					'name': 'credit_memo_details.tpl'
				,	'displayName': 'Credit Memo Detail Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-detail.png')
				}
			});

			pageType.registerPageType({
				'name': 'DepositApplicationDetail'
			,	'routes': ['transactionhistory/depositapplication/:id']
			,	'view': DepositApplicationDetailsView
			,	'defaultTemplate': {
					'name': 'deposit_application_details.tpl'
				,	'displayName': 'Deposit Application Details Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-detail.png')
				}
			});


			pageType.registerPageType({
				'name': 'DepositDetail'
			,	'routes': ['transactionhistory/customerdeposit/:id']
			,	'view': DepositDetailsView
			,	'defaultTemplate': {
					'name': 'deposit_details.tpl'
				,	'displayName': 'Deposit Detail Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-detail.png')
				}
			});

			pageType.registerPageType({
				'name': 'PaymentDetail'
			,	'routes': ['transactionhistory/customerpayment/:id']
			,	'view': CustomerPaymentDetailsView
			,	'defaultTemplate': {
					'name': 'customer_payment_details.tpl'
				,	'displayName': 'Payment Detail Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-transaction-detail.png')
				}
			});

			pageType.registerPageType({
				'name': 'OrderDetail'
			,	'routes': ['transactionhistory/cashsale/:id']
			,	'view': ReceiptDetailsView
			});

			pageType.registerPageType({
				'name': 'InvoiceDetail'
			,	'routes': ['transactionhistory/invoices/:id']
			,	'view': InvoiceDetailsView
			});
		}
	};
});
