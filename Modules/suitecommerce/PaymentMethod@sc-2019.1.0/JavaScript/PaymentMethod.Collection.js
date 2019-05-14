/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module PaymentMethod
define('PaymentMethod.Collection'
,	[	'PaymentInstrument.CreditCard.Model'
	,	'Backbone'
	]
,	function (
		Model
	,	Backbone
	)
{
	'use strict';

	// @class PaymentMethod.Collection Credit cards collection @extends Backbone.Collection
	return Backbone.Collection.extend({

		model: Model

	,	url: 'services/PaymentMethod.Service.ss'

	,	comparator: function (model)
		{
			return model.get('isdefault') !== 'T';// ? 0 : 1;
		}

		// @method getCollectionForRendering Get the payment methods collection including new payment method button for rendering
	,	getCollectionForRendering: function()
	{
		var cloned_collection;

		if (this && !!this.length)
		{
			cloned_collection = this.clone();

			var new_payment_method = this.first().clone();
			new_payment_method.set('internalid', '-1');
			
			cloned_collection.models.push(new_payment_method);
		}

		return cloned_collection;
	}

	});
});
