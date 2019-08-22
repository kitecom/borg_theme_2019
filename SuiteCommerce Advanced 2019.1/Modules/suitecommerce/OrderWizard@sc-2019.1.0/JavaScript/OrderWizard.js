/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizzard
define('OrderWizard'
,	[	'OrderWizard.Router'
	,	'LiveOrder.Model'
	,	'Profile.Model'
	,	'OrderWizard.View'
	]
,	function (
		OrderWizardRouter
	,	LiveOrderModel
	,	ProfileModel
	,	OrderWizardView
	)
{
	'use strict';

	return {

		mountToApp: function (application)
		{
			var order_wizard_router = new OrderWizardRouter(application, {
				model: LiveOrderModel.getInstance()
			,	profile: ProfileModel.getInstance()
			,	steps: application.getConfig('checkoutSteps')
			});

			OrderWizardView.wizard = order_wizard_router;

			var checkout_component = application.getComponent('Checkout');
			checkout_component._setOrderWizardRouter(order_wizard_router);
		}
	};
});
