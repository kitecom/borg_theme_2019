/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module PaymentWizard
define('PaymentWizard.View'
,	[	'Wizard.View'
	,	'Wizard.StepNavigation.View'

	,	'payment_wizard_layout.tpl'

	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		WizardView
	,	WizardStepNavigationView

	,	payment_wizard_layout_tpl

	,	_
	,	Backbone
	)
{
	'use strict';

	//@class PaymentWizard.View @extend Wizard.View
	return WizardView.extend({
		//@property {Function} template
		template: payment_wizard_layout_tpl
		//@property {String} bodyClass
	,	bodyClass: 'force-hide-side-nav'

	,	attributes: {
			'id': 'payment-wizard'
		,	'data-root-component-id': 'Wizard.View'
		}

		//@method initialize
    ,   initialize: function ()
        {
			this.wizard = this.constructor.wizard;

            WizardView.prototype.initialize.apply(this, arguments);
            this.title = _('Make a Payment').translate();
        }

	,	beforeShowContent: function beforeShowContent()
		{
			return this.wizard.runStep();
		}

	,	getPageDescription: function ()
		{
			return 'payment - ' + (Backbone.history.fragment||'').split('?')[0];
		}

    ,	childViews: {

	    	'Wizard.StepNavigation': function()
	    	{
	    		return new WizardStepNavigationView({wizard: this.wizard});
	    	}
	    }
	});
});
