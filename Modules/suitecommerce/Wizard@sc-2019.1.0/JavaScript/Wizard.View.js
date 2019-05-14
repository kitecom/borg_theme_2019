/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Wizard
define(
	'Wizard.View'
,	[
		'wizard.tpl'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Wizard.StepNavigation.View'
	,	'Tracker'
	]
,	function (
		wizard_tpl
	,	Backbone
	,	BackboneCompositeView
	,	WizardStepNavigationView
	,	Tracker
	)
{
	'use strict';

	// @class Wizard.View  Frame component, Renders the steps @extends Backbone.View
	return Backbone.View.extend({

		template: wizard_tpl
	,	enhancedEcommercePage: true
    ,   attributes: {
            'id': 'wizard'
		,	'data-root-component-id': 'Wizard.View'
        }

	,	events: {
			'click [data-action="previous-step"]': 'previousStep'
		,	'click [data-action="submit-step"]': 'submit'
		}

	,	childViews:
		{
			'Wizard.StepNavigation': function()
			{
				return new WizardStepNavigationView({wizard: this.wizard});
			}
		}

	,	initialize: function (options)
		{
			var url = Backbone.history.fragment.split('?')[0];

			this.currentStep = options.currentStep || this.wizard.steps[url];
		}

	,	render: function ()
		{
			this.title = this.currentStep.getName();

			// Renders itself
			this._render();

			// Then Renders the current Step
			this.currentStep.attributes = this.currentStep.attributes || {};
			this.currentStep.attributes['data-root-component-id'] = this.attributes['data-root-component-id'];
			this.currentStep.render();

			// Then adds the step in the #wizard-content element of self
			this.$('#wizard-content').empty().append(this.currentStep.$el);
		}

		// @method showError handle error messages on each step so we disable the global ErrorManagment
	,	showError: function (message)
		{
			this.wizard.manageError(message);
		}

		// @method previousStep
	,	previousStep: function(e)
		{
			this.wizard.getCurrentStep().previousStep(e);
		}
		// @method getHeaderView
	,	getHeaderView: function ()
		{
			return this.wizard.getCurrentStep() && this.wizard.getCurrentStep().headerView;
		}
		// @method getHeaderViewOptions
	,	getHeaderViewOptions: function()
		{
			return this.wizard.getCurrentStep() && this.wizard.getCurrentStep().headerViewOptions && this.wizard.getCurrentStep().headerViewOptions();
		}
		// @method getFooterView
	,	getFooterView: function ()
		{
			return this.wizard.getCurrentStep() && this.wizard.getCurrentStep().footerView;
		}
		// @method getFooterViewOptions
	,	getFooterViewOptions: function()
		{
			return this.wizard.getCurrentStep() && this.wizard.getCurrentStep().footerViewOptions && this.wizard.getCurrentStep().footerViewOptions();
		}

	,	getPageDescription: function ()
		{
			return 'checkout - ' + (Backbone.history.fragment||'').split('?')[0]; //remove parameters - we don't want a variable value for site-page
		}

		//@method submit
	,	submit :function(e)
		{
			this.wizard.getCurrentStep().submit(e);
		}

		// @method getContext @return {Wizard.View.Context}
	,	getContext: function()
		{
			// @class Wizard.View.Context
			return {
				// @property {Boolean} showBreadcrumb
				showBreadcrumb: !this.wizard.getCurrentStep().hideBreadcrumb
			};
			// @class Wizard.View
		}

	});
});
