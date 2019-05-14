<h2 class="payment-wizard-step-title">{{currentStepGroupName}}</h2>

<div data-type="alert-placeholder-step"></div>

<div class="payment-wizard-step-content-wrapper">
	<div id="wizard-step-content" class="payment-wizard-step-content-main"></div>
	<div id="wizard-step-content-right" class="payment-wizard-step-content-secondary"></div>


	{{#if showNavButtons}}
	<div class="payment-wizard-step-actions">
		<div class="payment-wizard-step-button-container">
			{{#if showContinueButton}}
				<button class="payment-wizard-step-button-continue" data-action="submit-step">
					{{continueButtonLabel}}
				</button>
			{{/if}}
			{{#if showBackButton}}
				<button class="payment-wizard-step-button-back" data-action="previous-step">
					{{translate 'Back'}}
				</button>
			{{else}}
				<a class="payment-wizard-step-button-back" href="/invoices"> 
					{{translate 'Back'}}
				</a>
			{{/if}}			
		</div>
	</div>
	{{/if}}

</div>




{{!----
Use the following context variables when customizing this template: 
	
	currentStepGroupName (String)
	continueButtonLabel (String)
	showNavButtons (Boolean)
	showBackButton (Boolean)
	showContinueButton (Boolean)
	showBreadcrumb (Boolean)

----}}
