<div class="order-wizard-paymentmethod-paypal-module-row">

	<a class="order-wizard-paymentmethod-paypal-module-container order-wizard-paymentmethod-paypal-module-container-selected">
		<input type="radio" name="paymentmethod-paypal-option" class="order-wizard-paymentmethod-paypal-module-radio" data-id="paypal" value="paypal" checked>
			<b>{{translate 'Selected'}}</b>
	</a>
	<div class="order-wizard-paymentmethod-paypal-module-details order-wizard-paymentmethod-paypal-module-container-selected">
		<div class="order-wizard-paymentmethod-paypal-module-details-container">
			<img class="order-wizard-paymentmethod-paypal-module-paypal-logo" src="{{getThemeAssetsPathWithDefault paypalImageUrl 'img/paypal.png'}}" alt="PayPal">
		</div>
	</div>
</div>


<div class="order-wizard-paymentmethod-paypal-module-description">

	{{#if isPaypalComplete}}

            <p>
                {{translate 'You have <b>selected to pay using PayPal</b> as your payment method.'}}
            </p>
            <p>
                {{translate 'To <b>review</b> your order, click the <b>"Continue" button</b> below.'}}
            </p>
        {{else}}
            <p>
                {{translate 'Please select the <b>"Continue To PayPal" button</b> below to <b>sign in into your PayPal</b> account.'}}
            </p>
            <p>
                {{translate 'You will be <b>redirected to PayPal</b>, but <b>will have an opportunity to review</b> your order back on our site before purchasing.'}}
            </p>
        {{/if}}
</div>


{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
