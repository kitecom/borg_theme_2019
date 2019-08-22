{{#if isNewPaymentMethod}}
	<a class="paymentinstrument-creditcard paymentinstrument-creditcard-new-card" href="/creditcards/new" data-toggle="show-in-modal">
		<div class="paymentinstrument-creditcard-new-card-title">
			<p><i class="paymentinstrument-creditcard-new-card-plus-icon"></i></p>
			{{translate 'Add Card'}}
		</div>
	</a>
{{else}}
	{{#if showSelector}}
		<a class="paymentinstrument-creditcard-selector {{#if isSelected}}paymentinstrument-creditcard-selected{{/if}}" data-action="select" data-id="{{creditCartId}}">
			<input type="radio" name="cards-options" class="paymentinstrument-creditcard-selector-option" data-id="{{creditCartId}}" value="{{creditCartId}}" {{#if isSelected}} checked {{/if}}>
			{{#if isSelected}}
				<b>{{translate 'Selected'}}</b>
			{{else}}
				{{translate 'Select'}}
			{{/if}}
		</a>
	{{/if}}

	<div class="paymentinstrument-creditcard {{#if isSelected}}paymentinstrument-creditcard-selected{{/if}}" data-id="{{creditCartId}}">
		<div class="paymentinstrument-creditcard-container">
			<div>
				{{#if showSecurityCodeForm}}
					<div class="paymentinstrument-creditcard-section">
				{{/if}}

				<div class="paymentinstrument-creditcard-header">
					<p class="paymentinstrument-creditcard-number"><b>{{translate 'Ending in'}}</b> {{lastfourdigits}} </p>
					{{#if showCreditCardImage}}
						<img class="paymentinstrument-creditcard-header-icon" src="{{paymentMethodImageUrl}}" alt="{{paymentName}}">
					{{else}}
						{{paymentName}}
					{{/if}}
				</div>

				<p class="paymentinstrument-creditcard-expdate"><b>{{translate 'Expires in'}}</b> {{expirationDate}}</p>
				<p class="paymentinstrument-creditcard-name">{{ccname}}</p>

				{{#if showDefaults}}
					<p class="paymentinstrument-creditcard-default">
						{{#if isDefaultCreditCard}}
							<i class="paymentinstrument-creditcard-default-icon"></i>
							{{translate 'Default Credit Card'}}
						{{/if}}
					</p>
				{{/if}}
				{{#if showSecurityCodeForm}}
					</div>
					<div class="paymentinstrument-creditcard-security-code-section">
						<form>
							<div data-view="CreditCard.Edit.Form.SecurityCode"></div>
						</form>
					</div>
				{{/if}}
			</div>

			{{#if showActions}}
				<div class="paymentinstrument-creditcard-actions">
					<a class="paymentinstrument-creditcard-action" href="/creditcards/{{creditCartId}}" data-toggle="show-in-modal">
						{{translate 'Edit'}}
					</a>
					<button class="paymentinstrument-creditcard-action" data-action="remove" data-id="{{creditCartId}}">
						{{translate 'Remove'}}
					</button>
				</div>
			{{/if}}
		</div>
	</div>
{{/if}}


{{!----
Use the following context variables when customizing this template:

	creditCartId (String)
	showSecurityCodeForm (Boolean)
	showCreditCardImage (Boolean)
	paymentMethodImageUrl (String)
	paymentName (String)
	ccnumber (String)
	ccname (String)
	expirationDate (String)
	showDefaults (Boolean)
	isDefaultpaymentinstrument-creditcard (Boolean)
	showSelect (Boolean)
	showActions (Boolean)

----}}
