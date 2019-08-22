<div>
	<header>
		<h1 class="requestquote-wizard-step-header-title">{{currentStepGroupName}}</h1>
	</header>
</div>

<div data-type="alert-placeholder-step"></div>

<div class="requestquote-wizard-step-content-wrapper">

	<div id="wizard-step-content" class="requestquote-wizard-step-content-main"></div>

	{{#if showNavButtons}}
		<div class="requestquote-wizard-step-actions">
			<div class="requestquote-wizard-step-button-container">
				{{#if showContinueButton}}
					<button class="requestquote-wizard-step-button-continue" data-action="submit-step">
						{{translate continueButtonLabel}}
					</button>
				{{/if}}
				{{#if showBackButton}}
					<button class="requestquote-wizard-step-button-back" data-action="previous-step">
						{{translate 'Back'}}
					</button>
				{{/if}}
			</div>
		</div>
	{{/if}}

	{{#if showBottomMessage}}
		<div class="requestquote-wizard-step-content-wrapper-bottom-content">
			<p class="requestquote-wizard-step-content-wrapper-disclaimer-message">
				{{{translate bottomMessage}}}
			</p>
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
	showBottomMessage (Boolean)
	bottomMessage (String)

----}}
