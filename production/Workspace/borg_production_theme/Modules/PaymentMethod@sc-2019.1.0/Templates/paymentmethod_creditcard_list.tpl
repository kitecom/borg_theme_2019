{{#if showBackToAccount}}
	<a href="/" class="paymentmethod-creditcard-list-button-back">
		<i class="paymentmethod-creditcard-list-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<section class="paymentmethod-creditcard-list">
	<h2>{{pageHeader}}</h2>
	<div class="paymentmethod-creditcard-list-collection" data-view="CreditCards.Collection"></div>
</section>



{{!----
Use the following context variables when customizing this template:

	pageHeader (String)
	showBackToAccount (Boolean)

----}}
