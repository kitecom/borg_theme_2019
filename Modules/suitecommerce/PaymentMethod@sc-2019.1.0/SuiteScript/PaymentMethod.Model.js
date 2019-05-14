/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// PaymentMethod.Model.js
// ----------------
// This file define the functions to be used on Payment Method service
define('PaymentMethod.Model'
,	[
		'SC.Model'
	,	'SC.Models.Init'
	,	'CreditCard.Model'
	,	'PaymentInstrument.Model'
	, 	'underscore'
	]
,	function (
		SCModel
	,	ModelsInit
	,	CreditCardModel
	,	PaymentInstrumentModel
	, 	_
)
{
	'use strict';

	var PaymentMethodModel =  SCModel.extend({
		name: 'PaymentMethod'

	,	get: function (id)
		{
			//Return a specific payment method
			return this.paymentmethod.get(id);
		}

	,	getDefault: function ()
		{
			//Return the payment method that the customer setted to default
			return this.paymentmethod.getDefault();
		}

	,	list: function ()
		{
			//Return all the payment methods
			return this.paymentmethod.list();
		}

	,	update: function (id, data)
		{
			//Update the payment method if the data is valid
			return this.paymentmethod.update(id, data);
		}

	,	create: function (data)
		{
			//Create a new payment method if the data is valid
			return this.paymentmethod.create(data);
		}

	,	remove: function (id)
		{
			//Remove a specific payment method
			return this.paymentmethod.remove(id);
		}
	});

	PaymentMethodModel.paymentmethod = (function (){
		var paymentInstrumentEnabled = ModelsInit.context.getSetting('FEATURE', 'PAYMENTINSTRUMENTS') === 'T';

		if(paymentInstrumentEnabled){
			return PaymentInstrumentModel;
		}

		return CreditCardModel;
	})();

	return PaymentMethodModel;
});