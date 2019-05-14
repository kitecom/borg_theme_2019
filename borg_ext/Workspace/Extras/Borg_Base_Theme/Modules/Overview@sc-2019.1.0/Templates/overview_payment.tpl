<article class="overview-payment">
	<div class="overview-payment-header">
		<h4>{{translate 'Payment'}}</h4>
	</div>

	<section class="overview-payment-card">
	{{#if hasDefaultCreditCard}}
		<div data-view="CreditCard.View"></div>
		<div class="overview-payment-card-button-edit-container">
			<a class="overview-payment-card-button-edit" href="/creditcards/{{creditCardInternalid}}" data-toggle="show-in-modal">{{translate 'Edit'}}</a>
		</div>
	{{else}}
		<div class="overview-payment-card-content">
			<p>{{translate 'We have no default credit card on file for this account.'}}</p>
		</div>
		<a href="/creditcards/new" class="overview-payment-card-button-edit" data-toggle="show-in-modal">{{translate 'Add a Credit Card'}}</a>
	{{/if}}
	</section>
</article>




{{!----
Use the following context variables when customizing this template:

	hasDefaultCreditCard (Boolean)
	creditCardInternalid (String)

----}}
