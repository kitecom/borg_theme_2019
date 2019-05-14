<a class="order-wizard-paymentmethod-external-module-container {{#if isSelected}}order-wizard-paymentmethod-external-module-container-selected{{/if}}" data-action="select" data-id="{{type}}">
	<input type="radio" name="paymentmethod-external-option" class="order-wizard-paymentmethod-external-module-radio" data-id="{{type}}" value="{{type}}" {{#if isSelected}} checked {{/if}}>
	{{#if isSelected}}
		<b>{{translate 'Selected'}}</b>
	{{else}}
		{{translate 'Select'}}
	{{/if}}
</a>
<div class="order-wizard-paymentmethod-external-module-details {{#if isSelected}}order-wizard-paymentmethod-external-module-container-selected{{/if}}"  data-id="{{type}}">
	<div class="order-wizard-paymentmethod-external-module-details-container">
		<img class="order-wizard-paymentmethod-external-module-details-container-image" src="{{imageUrl}}" alt="{{name}}">
	</div>
</div>

{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
