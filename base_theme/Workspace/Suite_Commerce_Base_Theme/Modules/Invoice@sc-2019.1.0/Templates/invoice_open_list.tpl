{{#if showBackToAccount}}
	<a href="/" class="invoice-open-list-button-back">
		<i class="invoice-open-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="invoice-open-list">

	{{#if showInvoices}}
		<div data-view="Invoices.Message"></div>
	{{/if}}

	<header class="invoice-open-list-header">
		<h2 class="invoice-open-list-title">{{pageHeader}}</h2>
	</header>

	<div class="invoice-open-list-header-nav">
		<div class="invoice-open-list-header-button-group">
			<span class="invoice-open-list-header-button-open">{{translate 'Open'}}</span>
			<a href="/paid-invoices" class="invoice-open-list-header-button-paid">{{translate 'Paid in Full'}}</a>
		</div>

		{{#if showMakeAPaymentButton}}
			<a data-permissions="transactions.tranCustPymt.2, transactions.tranCustInvc.1" data-type="make-a-payment" class="invoice-open-list-button-payment"
			{{#if enableMakeAPaymentButton}}href="/make-a-payment"{{else}}disabled{{/if}}>
					{{translate 'Make a Payment'}}
			</a>
		{{/if}}
	</div>

	<div data-view="ListHeader"></div>

	<div class="invoice-open-list-body">
		{{#if showInvoices}}

			<table class="invoice-open-list-records">
				<thead class="invoice-open-list-records-head">
					<tr class="invoice-open-list-records-head-row">
						<th></th>
						<th></th>
						{{#each columns}}
						<th>
								{{label}}
						</th>
						{{/each}}
				</thead>

				<tbody class="invoice-open-list-records-body" data-view="Invoice.Results"></tbody>

			</table>

		{{else}}
			<div class="invoice-open-list-no-records">
				<h5>{{translate 'You don\'t have any Open Invoices at the moment,<br/>see <a href="/paid-invoices" class="invoice-open-list-anchor-paid">Invoices Paid In Full</a>'}}</h5>
			</div>
		{{/if}}
	</div>
</section>



{{!----
Use the following context variables when customizing this template:

	invoices (Array)
	showInvoices (Boolean)
	pageHeader (String)
	showMakeAPaymentButton (Boolean)
	enableMakeAPaymentButton (Boolean)
	showBackToAccount (Boolean)

----}}
