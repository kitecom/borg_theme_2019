<div class="order-wizard-paymentmethod-creditcard-module">
	{{#if showTitle}}
		<h3 class="order-wizard-paymentmethod-creditcard-module-title">{{title}}</h3>
	{{/if}}
	{{#if showList}}
		<div id="creditcard-module-list-placeholder" class="order-wizard-paymentmethod-creditcard-module-list-placeholder">
			<div data-view="CreditCard.List"></div>
		</div>
	{{/if}}
	{{#if showForm}}
		<div class="order-wizard-paymentmethod-creditcard-module-form">
			<form method="POST" data-view="CreditCard.Form"></form>
		</div>
	{{/if}}


	<p class="order-wizard-paymentmethod-creditcard-module-learn-more"> <i class="order-wizard-paymentmethod-creditcard-module-learn-more-icon"></i> {{ translate 'Learn more about <a class="order-wizard-paymentmethod-creditcard-module-learn-more-link" data-action="show-safe-secure-info"> safe and secure </a> shopping' }} </p>
</div>



{{!----
Use the following context variables when customizing this template: 
	
	showForm (Boolean)
	showList (Boolean)
	showSelectedCreditCard (Boolean)
	showTitle (Boolean)
	title (String)
	selectedCreditCard (Object)
	selectedCreditCard.debitcardissueno (undefined)
	selectedCreditCard.validfrommon (undefined)
	selectedCreditCard.expyear (String)
	selectedCreditCard.ccexpiredate (String)
	selectedCreditCard.validfromyear (undefined)
	selectedCreditCard.ccsecuritycode (String)
	selectedCreditCard.savecard (String)
	selectedCreditCard.internalid (String)
	selectedCreditCard.expmonth (String)
	selectedCreditCard.customercode (undefined)
	selectedCreditCard.validfrom (undefined)
	selectedCreditCard.ccname (String)
	selectedCreditCard.ccdefault (String)
	selectedCreditCard.paymentmethod (Object)
	selectedCreditCard.paymentmethod.internalid (String)
	selectedCreditCard.paymentmethod.isexternal (String)
	selectedCreditCard.paymentmethod.merchantid (String)
	selectedCreditCard.paymentmethod.name (String)
	selectedCreditCard.paymentmethod.imagesrc (Array)
	selectedCreditCard.paymentmethod.imagesrc.0 (String)
	selectedCreditCard.paymentmethod.ispaypal (String)
	selectedCreditCard.paymentmethod.creditcard (String)
	selectedCreditCard.paymentmethod.key (String)
	selectedCreditCard.ccnumber (String)
	selectedCreditCard.hasSecurityCode (Boolean)
	creditCards (Array)

----}}
