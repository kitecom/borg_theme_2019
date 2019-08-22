<div data-action="skip-login-message" class="order-wizard-step-guest-message"></div>

{{#if showTitle}}
<header class="order-wizard-step-header">
	<h2 data-type="wizard-step-name-container" class="order-wizard-step-title">{{title}}</h2>
</header>
{{/if}}

<div data-type="alert-placeholder-step"></div>

<div class="order-wizard-step-review-wrapper">
	
	<section class="order-wizard-step-review-main">
		<div id="wizard-step-review-left"></div>
	</section>

	<section id="wizard-step-review-right" class="order-wizard-step-review-secondary">
	</section>

</div>
<div data-cms-area="order_wizard_cms_area_1" data-cms-area-filters="page_type"></div>
<div class="order-wizard-step-content-wrapper">
	
	<div class="order-wizard-step-content-main">
		<div data-cms-area="order_wizard_cms_area_2" data-cms-area-filters="page_type"></div>
		<section id="wizard-step-content"></section>
		<div data-cms-area="order_wizard_cms_area_3" data-cms-area-filters="page_type"></div>
	</div>


	<div class="order-wizard-step-content-secondary">
		<div data-cms-area="order_wizard_cms_area_4" data-cms-area-filters="page_type"></div>
		<section id="wizard-step-content-right" ></section>
	</div>
	

	<div class="order-wizard-step-actions">

		{{#if showBottomMessage}}
		<small class="order-wizard-step-message {{bottomMessageClass}}">
			{{bottomMessage}}
		</small>
		{{/if}}

		<div class="order-wizard-step-button-container">

			{{#if showContinueButton}}
			<button class="order-wizard-step-button-continue" data-action="submit-step">
				{{continueButtonLabel}}
			</button>
			{{/if}}
			<button class="order-wizard-step-button-back" {{#unless showBackButton}}style="display:none;"{{/unless}} data-action="previous-step">
				{{translate 'Back'}}
			</button>
		</div>
	</div>
</div>



{{!----
Use the following context variables when customizing this template: 
	
	showTitle (Boolean)
	title (String)
	showContinueButton (Boolean)
	continueButtonLabel (String)
	showSecondContinueButtonOnPhone (Boolean)
	showBackButton (Boolean)
	showBottomMessage (Boolean)
	bottomMessage (String)
	bottomMessageClass (String)

----}}
