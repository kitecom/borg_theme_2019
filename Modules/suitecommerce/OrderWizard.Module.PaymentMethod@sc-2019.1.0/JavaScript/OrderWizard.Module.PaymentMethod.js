/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// OrderWizard.Module.PaymentMethod.js
// --------------------------------
//
define('OrderWizard.Module.PaymentMethod'
,	[	
		'Wizard.Module'
	]
,	function (
		WizardModule
	)
{
	'use strict';

	return WizardModule.extend({

		submit: function ()
		{
			// Gets the payment method for this object
			var payment_method = this.paymentMethod;
			
			return this.model.addPayment(payment_method);
		}
	});
});