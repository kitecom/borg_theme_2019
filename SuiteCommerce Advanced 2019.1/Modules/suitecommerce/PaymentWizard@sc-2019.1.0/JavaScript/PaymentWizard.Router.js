/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module PaymentWizard
define('PaymentWizard.Router'
,	[	'Wizard.Router'
	,	'PaymentWizard.View'
	,	'PaymentWizard.Step'

	,	'jQuery'
	,	'Utils'
	]
,	function (
		WizardRouter
	,	PaymentWizardView
	,	PaymentWizardStep

	,	jQuery
	,	Utils
	)
{
	'use strict';

	//@class PaymentWizard.Router @extend Backbone.Router
	return WizardRouter.extend({

		view: PaymentWizardView

	,	step: PaymentWizardStep

	,	_registerPageType: function _registerPageType(options)
		{
			var pageType = this.application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'payment-wizard'
			,	'routes': options.routes
			,	'view': PaymentWizardView
			,	'defaultTemplate': {
					'name': 'payment_wizard_layout.tpl'
				,	'displayName': 'Payment wizard default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-payment-wizard.png')
				}
			});
		}

		//@method runStep
	,	runStep: function()
		{
			if (SC.ENVIRONMENT.permissions.transactions.tranCustPymt < 2)
			{
				this.application.getLayout().forbiddenError();

				return jQuery.Deferred().reject();
			}
			else
			{
				return WizardRouter.prototype.runStep.apply(this, arguments);
			}
		}
		//@method hidePayment
	,	hidePayment: function ()
		{
			return (!this.model.get('payment') && !this.model.get('confirmation')) || (this.model.get('confirmation') && !this.model.get('confirmation').payment);
		}
	});
});
