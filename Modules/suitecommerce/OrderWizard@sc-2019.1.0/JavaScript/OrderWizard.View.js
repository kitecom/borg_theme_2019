/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Wizard
define('OrderWizard.View'
,	[
		'Wizard.View'
	,	'LiveOrder.Model'
	,	'Profile.Model'
	,	'SC.Configuration'
	]
,	function
	(
		WizardView
	,	LiveOrderModel
	,	ProfileModel
	,	Configuration
	)
{
  	'use strict';

	// @class Wizard.View  Frame component, Renders the steps @extends Backbone.View
	return WizardView.extend({
		attributes: {
			'id': 'checkout'
		,	'data-root-component-id': 'Wizard.View'
    	}

	,	initialize: function initialize()
		{
			this.model = LiveOrderModel.getInstance();
			this.profile = ProfileModel.getInstance();
			this.steps = Configuration.get('checkoutSteps');

			this.wizard = this.constructor.wizard;

			WizardView.prototype.initialize.apply(this, arguments);
		}

	,	beforeShowContent: function beforeShowContent()
		{
			if (this.wizard.indirectURL)
			{
				this.wizard.indirectURL = false;
				return this.wizard._runStep();
			}
			else
			{
				return this.wizard.runStep();
			}
		}
	});
});
