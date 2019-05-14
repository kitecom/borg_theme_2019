/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define('ICart.Component'
,	[
		'SC.BaseComponent'
	,	'Cart.Component.DataValidator'
	,	'SC.Models.Init'
	,	'Utils'

	,	'Application'

	,	'underscore'
	]
,	function (
		SCBaseComponent
	,	CartComponentDataValidator
	,	ModelsInit
	,	Utils

	,	Application

	,	_
	)
{
	'use strict';

	//Did in this way to be compatible with SCIS
	var StoreItem;

	try {
		StoreItem = require('StoreItem.Model');
	}
	catch(e)
	{
	}

	// We removed the is-my-json-valid library but kept the code to be able to add another validation library without code changes
	var isMyJsonValid
	,	new_line_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.newLineSchema)
	,	edit_line_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.editLineSchema)
	,	payment_method_validator = isMyJsonValid && isMyJsonValid(CartComponentDataValidator.paymentMethodSchema);

	// @function format formats An entity data grouping both commons attributes (SCIS and SCA) and non-commons. The last goes into the 'extras' key
	// @private
	// @param {Object} entity Data object to format
	// @param {Array<String>} commonAttrs Array with a string of all the common attributes that are at the first level of the returned formatted object
	// @return {Object} A Formatted object structured with all the unique properties inside the extra object. Extras additional properties unique to SCIS or SCA
	var	format = function format(entity, commonAttrs)
	{
			var formatted = {extras: {}};

			_.keys(entity).forEach(function(attr)
			{
				if(_.contains(commonAttrs, attr))
				{
					formatted[attr] = entity[attr];
				}
				else
				{
					formatted.extras[attr] = entity[attr];
				}
			});

			return formatted;
		}


		// @class ICart.Component An abstract base class for backend-end Cart component.
		// For example, concrete front-end Cart implementations like SCA and SCIS inherit from this class
		// @extends SC.BaseComponent
		// @public @extlayer
	,	icart_component = SCBaseComponent.extend({

			componentName: 'Cart'

			// @method _validateLine Validates the input agains the newLineSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} line to validate
			// @return {Error} validation error
		,	_validateLine: function _validateLine(line)
			{
				if (new_line_validator && !new_line_validator(line))
				{
					var errors = _.reduce(new_line_validator.errors, function(memo, error)
					{
						return memo + ' ' + error.field + ' ' + error.message;
					}, '');

					this._reportError('INVALID_PARAM', 'Invalid line: '+ errors);
				}
			}

			// @method _validateEditLine Validates the input agains the editLineSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} line to validate
			// @return {Error} validation error
		,	_validateEditLine: function _validateEditLine(line)
			{
				if (edit_line_validator && !edit_line_validator(line))
				{
					var errors = _.reduce(edit_line_validator.errors, function(memo, error)
					{
						return memo+' '+error.field+' '+error.message;
					}, '');
					this._reportError('INVALID_PARAM', 'Invalid line: '+errors);
				}
			}

			// @method _validatePaymentMethod Validates the input agains the paymentMethodSchema. Used by Cart.Component
			// not working because of removed is-my-json-valid so read the schema for documentation
			// @private
			// @param {Object} payment_method to validate
			// @return {Error} validation error
		,	_validatePaymentMethod: function _validatePaymentMethod(payment_method)
			{
				if(payment_method_validator && !payment_method_validator(payment_method))
				{
					var errors = _.reduce(payment_method_validator.errors, function(memo, error)
					{
						return memo+' '+error.field+' '+error.message;
					}, '');
					this._reportError('INVALID_PARAM', 'Invalid payment method: '+errors);
				}
			}

			// @method addLine Adds a new line into the cart
			// @public @extlayer
			// @param {Line} data
			// @return {Deferred<String>} Return a Deferred that is resolved into the added line id, String, in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addLine: function addLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
			// @method addLines Adds new lines into the cart
			// @public @extlayer
			// @param {Array<Line>} data
			// @return {Deferred<Array<String>>} Return a Deferred that is resolved into the added lines ids, String, in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addLines: function addLines(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getLines returns the lines of the cart
			// @return {Deferred<Array<Line>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
			// @public @extlayer
		,	getLines: function getLines()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removeLine Removes a line from the cart
			// @public @extlayer
			// @param {String} internalid
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	removeLine: function removeLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateLine Updates a line into the cart
			// @public @extlayer
			// @param {Line} data
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	updateLine: function updateLine(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getSummary Returns the summary of the cart
			// @public @extlayer
			// @return {Deferred<Summary>} Return a Deferred that is resolved with a @?class Summary instance in the case
			// the operation was done successfully or rejected with an error message.
		,	getSummary: function getSummary()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method submit Submits the order
			// @public @extlayer
			// @return {Deferred<ConfirmationSubmit>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	submit: function submit()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPayment Adds a payment method. If none is passed the current method is removed
			// @public @extlayer
			// @param {PaymentMethod} data
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	addPayment: function addPayment(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getPaymentMethods returns the payment methods added to the order
			// @public @extlayer
			// @return {Deferred<Array<PaymentMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getPaymentMethods: function getPaymentMethods()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPromotion Adds a promotion.
			// @param {String} promocode
			// @public @extlayer
		,	addPromotion: function addPromotion(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removePromotion Removes a promotion or all promotions if promocode is null
			// @param {String} promocode
			// @public @extlayer
		,	removePromotion: function removePromotion(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getPromotions returns the promotions' codes added to the cart
			// @public @extlayer
			// @return {Deferred<Array<Promotion>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getPromotions: function getPromotions()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method estimateShipping Returns the estimated shipping costs.
			// @public @extlayer
			// @param {Address} data
			// @return {Deferred<Summary>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	estimateShipping: function estimateShipping(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method clearEstimateShipping Removes the shipping method.
			// @public @extlayer
			// @return {Deferred<Summary>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	clearEstimateShipping: function clearEstimateShipping()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getShipAddress Returns the ship address of the order
			// @public @extlayer
			// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipAddress: function getShipAddress()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getBillAddress Returns the bill address of the order
			// @public @extlayer
			// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getBillAddress: function getBillAddress()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method setShipAddress Sets the ship address
			// @param {String} address_id
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setShipAddress: function setShipAddress(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method setBillAddress Sets the bill address
			// @param {String} address_id
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setBillAddress: function setBillAddress(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method getShipMethods Returns the ship methods of the order
			// @public @extlayer
			// @return {Deferred<Array<ShipMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipMethods: function getShipMethods()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getShipMethod Returns the ship method of the order
			// @public @extlayer
			// @return {Deferred<ShipMethod>} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	getShipMethod: function getShipMethod()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			// @method setShippingMethod Sets the ship method of the order
			// @public @extlayer
			// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
			// or the promise is rejected with an error message.
		,	setShippingMethod: function setShippingMethod(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method voidLine Voids a line. Implemented only for SCIS
			// @public @extlayer
		,	voidLine: function voidLine()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method unvoidLine Un-voids a line. Implemented only for SCIS
			// @public @extlayer
		,	unvoidLine: function unvoidLine()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateCustomer Updates a customer data. Implemented only for SCIS
			// @public @extlayer
		,	updateCustomer: function updateCustomer()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// The methods below are explicitly declared in order to clarify the available API.
			// These are auto-generated by SC.BaseComponent so, don't need to do any implementation (does the same but synchronously)

			// @method addLineSync Synchronous version of @?method addLine
			// @public @extlayer
		,	addLineSync: function addLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addLinesSync Synchronous version of @?method addLines
			// @public @extlayer
		,	addLinesSync: function addLinesSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getLinesSync Synchronous version of @?method getLines
			// @public @extlayer
		,	getLinesSync: function getLinesSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method removeLineSync Synchronous version of @?method removeLine
			// @public @extlayer
		,	removeLineSync: function removeLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateLineSync Synchronous version of @?method  updateLine
			// @public @extlayer
		,	updateLineSync: function updateLineSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method getSummarySync Synchronous version of @?method getSummary
			// @public @extlayer
		,	getSummarySync: function getSummarySync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method submitSync Synchronous version of @?method  submit
			// @public @extlayer
		,	submitSync: function submitSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method addPaymentSync Synchronous version of @?method addPayment
			// @public @extlayer
		,	addPaymentSync: function addPaymentSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getPaymentMethodsSync Synchronous version of @?method getPaymentMethods
			//@public @extlayer
		,	getPaymentMethodsSync: function getPaymentMethodsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method addPromotionSync Synchronous version of @?method addPromotion
			//@public @extlayer
		,	addPromotionSync: function addPromotionSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method removePromotionSync Synchronous version of @?method removePromotion
			//@public @extlayer
		,	removePromotionSync: function removePromotionSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getPromotionsSync Synchronous version of @?method getPromotions
			//@public @extlayer
		,	getPromotionsSync: function getPromotionsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method estimateShippingSync Synchronous version of @?method estimateShipping
			//@public @extlayer
		,	estimateShippingSync: function estimateShippingSync(data)
			{
				//jshint unused:false
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method clearEstimateShippingSync Synchronous version of @?method clearEstimateShipping
			//@public @extlayer
		,	clearEstimateShippingSync: function clearEstimateShippingSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		
			//@method getShipAddressSync Synchronous version of @?method getShipAddress
			//@public @extlayer
		,	getShipAddressSync: function getShipAddressSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getBillAddressSync Synchronous version of @?method getBillAddress
			//@public @extlayer
		,	getBillAddressSync: function getBillAddressSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getShipMethodsSync Synchronous version of @?method getShipMethods
			//@public @extlayer
		,	getShipMethodsSync: function getShipMethodsSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method getShipMethodSync Synchronous version of @?method getShipMethod
			//@public @extlayer
		,	getShipMethodSync: function getShipMethodSync()
			{
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			//@method voidLineSync Synchronous version of @?method voidLine
			//Implemented only for SCIS.
			//@public @extlayer
		,	voidLineSync: function voidLineSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method unvoidLineSync Synchronous version of @?method unvoidLine
			// Implemented only for SCIS. In other implementations throws an Error
			// @public @extlayer
		,	unvoidLineSync: function unvoidLineSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}

			// @method updateCustomerSync Synchronous version of @?method  updateCustomer
			// Implemented only for SCIS. In other implementations throws an Error
			// @public @extlayer
		,	updateCustomerSync: function updateCustomerSync()
			{
				//implemented only for SCIS
				throw SC.ERROR_IDENTIFIERS.notImplemented;
			}
		

			//Normalization functions used by {@method _suscribeToInnerEvents} called by Cart.Component

		,	_normalizeAddressId: function _normalizeAddressId(data)
			{
				var address = data[0] || data[1];
				
				return {
					address_id: address.billaddress || address.shipaddress
				};
			}
		
		,	_normalizeShipMethodId: function _normalizeShipMethodId(data)
			{
				var shipmethod = data[0] || data[1];
				
				return {
					shipmethod_id: shipmethod.shipmethod
				};
			}
		
			//@method _normalizeSummary formats the summary grouping both commons attributes (SCIS and SCA) and non-commons.
			//The last into a extras named object
			//@private
			//@param {Summary} summary An object containing the summary
		,	_normalizeSummary: function _normalizeSummary(summary)
			{
				var commonSummaryAttrs = [
					'total'
				,	'taxtotal'
				,	'tax2total'
				,	'discounttotal'
				,	'subtotal'
				,	'shippingcost'
				,	'handlingcost'
				,	'giftcertapplied'
				,	'estimatedshipping'
				];
				return format(summary, commonSummaryAttrs);
			}

			// @method _normalizeLine formats the line grouping both commons attributes (SCIS and SCA) and non-commons.
			// The last into a extras named object.
			// @private
			// @param {Object} line
		,	_normalizeLine: function _normalizeLine(line)
			{
				line.item = StoreItem ? StoreItem.get(line.item.internalid, line.item.itemtype || line.item.type, 'details') : line.item;

				var commonLineAttrs = [
						'internalid'
					,	'item'
					,	'quantity'
					,	'amount'
					,	'rate'
					,	'tax_amount'
					,	'tax_code'
					,	'itemtype'
					,	'options'
					]
				,	commonItemAttrs = [
						'internalid'
					,	'itemid'
					,	'displayname'
					,	'isinactive'
					,	'itemtype'
					,	'minimumquantity'
					];

				var formatted_line = format(line, commonLineAttrs);
				formatted_line.item = format(line.item, commonItemAttrs);

				return formatted_line;
			}

			// @method _normalizeAddLineBefore formats the line that will receive as parameter the event handler of 'beforeAddLine'
			// @private
			// @param {Line} line
		,	_normalizeAddLineBefore: function _normalizeAddLineBefore(data)
			{
				return {
					line: this._normalizeLine(data[0])
				};
			}

			// @method _normalizeAddLineAfter formats the line that will receive as parameter the event handler of 'afterAddLine'
			// @private
			// @param {Line} line
		,	_normalizeAddLineAfter: function _normalizeAddLineAfter(data)
			{
				return {
					result: data[0]
				,	line: this._normalizeLine(data[1])
				};
			}

			// @method _normalizeRemoveLineBefore formats the line that will receive as parameter the event handler of 'beforeRemoveLine'
			// @private
		,	_normalizeRemoveLineBefore: function _normalizeRemoveLineBefore(data)
			{
				return {
					internalid: data[0]
				};
			}

			// @method _normalizeRemoveLineAfter formats the line that will receive as parameter the event handler of 'afterRemoveLine'
			// @private
		,	_normalizeRemoveLineAfter: function _normalizeRemoveLineAfter(data)
			{
				return {
					result: data[0]
				,	internalid: data[1]
				};
			}

			// @method _normalizeUpdateLineBefore formats the line that will receive as parameter the event handler of 'beforeUpdateLine'
			// @private
		,	_normalizeUpdateLineBefore: function _normalizeUpdateLineBefore(data)
			{
				return {
					line: this._normalizeLine(data[1])
				};
			}

			// @method _normalizeUpdateLineAfter formats the line that will receive as parameter the event handler of 'afterUpdateLine'
			// @private
		,	_normalizeUpdateLineAfter: function _normalizeUpdateLineAfter(data)
			{
				return {
					result: data[0]
				,	line: this._normalizeLine(data[2])
				};
			}

			// @method _normalizeSubmitBefore formats the line that will receive as parameter the event handler of 'beforeSubmit'
			// @private
		,	_normalizeSubmitBefore: function _normalizeSubmitBefore()
			{
				return {};
			}

			// @method _normalizeSubmitBefore formats the line that will receive as parameter the event handler of 'afterSubmit'
			// @private
		,	_normalizeSubmitAfter: function _normalizeSubmitAfter(data)
			{
				return {
					result: data[0]
				};
			}

		,	_normalizeEstimateBefore: function _normalizeEstimateBefore(data)
			{
				var address = data[0].address;

				return {
					address: address
				};
			}

		,	_normalizeEstimateAfter: function _normalizeEstimateAfter(data)
			{
				var address = data[0]
				,	summary = data[1];

				return {
					result: this._normalizeSummary(summary)
				,	address: address
				};
			}

		,	_normalizeRemoveEstimateBefore: function _normalizeRemoveEstimateBefore()
			{
				return {};
			}

		,	_normalizeRemoveEstimateAfter: function _normalizeRemoveEstimateAfter(data)
			{
				var summary = data[0];
				return {
					result: this._normalizeSummary(summary)
				};
			}

			// @method _normalizePaymentMethod formats the payment method
			// @private
		,	_normalizePaymentMethod: function _normalizePaymentMethod(data)
			{
				var payment_method = Utils.deepCopy(_.first(data.paymentmethods));

				if(_.isUndefined(payment_method))
				{
					return {};
				}

				var commonPaymentMethodAttrs = [
						'internalid'
					,	'type'
					,	'creditcard'
					,	'key'
					,	'thankyouurl'
					,	'errorurl'
					,	'giftcertificate'
					]
				,	commonCreditCardAttrs = [
						'ccnumber'
					,	'ccname'
					,	'ccexpiredate'
					,	'expmonth'
					,	'expyear'
					,	'ccsecuritycode'
					,	'paymentmethod'
					]
				,	commonCreditCardPaymentAttrs = [
						'internalid'
					,	'name'
					,	'creditcard'
					,	'ispaypal'
					,	'key'
					]
				,	commonGiftCertificateAttrs = [
						'internalid'
					,	'name'
					,	'creditcard'
					,	'ispaypal'
					,	'key'
					];

				var formatted_payment_method = format(payment_method, commonPaymentMethodAttrs);

				if(payment_method.creditcard)
				{
					formatted_payment_method.creditcard = format(payment_method.creditcard, commonCreditCardAttrs);

					if(payment_method.creditcard.paymentmethod)
					{
						formatted_payment_method.creditcard.paymentmethod = format(payment_method.creditcard.paymentmethod, commonCreditCardPaymentAttrs);
					}
				}

				if(payment_method.giftcertificate)
				{
					formatted_payment_method.giftcertificate = format(payment_method.giftcertificate, commonGiftCertificateAttrs);
				}

				return formatted_payment_method;
			}

			// @method _normalizePaymentMethodBefore formats the line that will receive as parameter the event handler of 'beforeAddPayment'
			// @private
		,	_normalizePaymentMethodBefore: function _normalizePaymentMethodBefore(data)
			{
				return {
					payment_method: this._normalizePaymentMethod(data[0])
				};
			}

			// @method _normalizePaymentMethodAfter formats the line that will receive as parameter the event handler of 'afterAddPayment'
			// @private
		,	_normalizePaymentMethodAfter: function _normalizePaymentMethodAfter(data)
			{
				return {
					payment_method: this._normalizePaymentMethod(data[1])
				};
			}

			// @method _normalizeAddPromotionBefore formats the Promocodes that will receive as parameter the event handler of beforeAddPromotion'
			// @private
		,	_normalizeAddPromotionBefore: function _normalizeAddPromotionBefore (data)
			{
				return {
					promocode: data[0]
				};
			}

		,	_normalizeAddPromotion: function _normalizeAddPromotion(inner_promotion)
			{
				var promotion = Utils.deepCopy(inner_promotion)
				,	commonPromotionAttrs = [
						'internalid'
					,	'type'
					,	'name'
					,	'rate'
					,	'code'
					,	'errormsg'
					,	'isvalid'
					];

				return format(promotion, commonPromotionAttrs);
			}
		
			// @method _normalizeAddPromotionAfter formats the Promocodes that will receive as parameter the event handler of afterAddPromotion'
			// @private
		,	_normalizeAddPromotionAfter: function _normalizeAddPromotionAfter (data)
			{
				return {
					promocode: data[1]
				};
			}

			// @method _normalizeRemovePromotionBefore formats the Promocodes that will receive as parameter the event handler of beforeRemovePromotion'
			// @private
		,	_normalizeRemovePromotionBefore: function _normalizeRemovePromotionBefore (promocode)
			{
				return {
					promocode: promocode
				};
			}

			// @method _normalizeRemovePromotionAfter formats the Promocodes that will receive as parameter the event handler of afterRemovePromotion'
			// @private
		,	_normalizeRemovePromotionAfter: function _normalizeRemovePromotionAfter (promocode)
			{
				return {
					promocode: promocode
				};
			}
		
		,	_normalizeAddress: function _normalizeAddress(inner_address)
			{
				var address = Utils.deepCopy(inner_address)
				,	commonAddressAttrs = [
						'internalid'
					,	'zip'
					,	'country'
					,	'addr1'
					,	'addr2'
					,	'addr3'
					,	'city'
					,	'company'
					,	'defaultbilling'
					,	'defaultshipping'
					,	'fullname'
					,	'isresidential'
					,	'isvalid'
					,	'state'
					];

				return format(address, commonAddressAttrs);
			}
		
		,	_normalizeShipMethods: function _normalizeShipMethods(inner_shipmethod)
			{
				var ship_method = Utils.deepCopy(inner_shipmethod)
				,	commonShipMethodAttrs = [
						'internalid'
					,	'name'
					,	'rate'
					,	'rate_formatted'
					,	'shipcarrier'
					];
				
				return format(ship_method, commonShipMethodAttrs);
			}
		
	});

	return icart_component;
});

//@class FormattedObject
//@property {Object} extras additional properties unique to SCIS or SCA

// extra class definitions:

// @class ShipMethod
// @property {String} internalid
// @property {String} name
// @property {Number} rate
// @property {String} rate_formatted
// @property {String} shipcarrier

// @class Address
// @property {String} internalid
// @property {String} zip
// @property {String} country
// @property {String} addr1
// @property {String} addr2
// @property {String} addr3
// @property {String} city
// @property {String} company
// @property {Boolean} defaultbilling
// @property {Boolean} defaultshipping
// @property {String} fullname
// @property {Boolean} isresidential
// @property {Boolean} isvalid
// @property {String} state

// @class PaymentMethod
// @property {String} internalid
// @property {String} type [creditcard, invoice, paypal, giftcertificate, external_checkout]
// @property {CreditCard} creditcard Required only if it is a creditcard
// @property {String} key
// @property {String} thankyouurl
// @property {String} errorurl
// @property {GiftCertificate} giftcertificate Required only if it is a giftcertificate

// @class CreditCard
// @property {String} ccnumber
// @property {String} ccname
// @property {String} ccexpiredate
// @property {String} expmonth
// @property {String} expyear
// @property {String} ccsecuritycode
// @property {InnerPaymentMethod} paymentmethod

// @class InnerPaymentMethod
// @property {String} internalid
// @property {String} name
// @property {Boolean} creditcard
// @property {Boolean} ispaypal
// @property {String} key

// @class GiftCertificate
// @property {String} code

// @class Line
// @property {String} internalid
// @property {Number} quantity
// @property {Number} amount
// @property {Number} rate
// @property {Number} tax_amount
// @property {String} tax_code
// @property {String} itemtype
// @property {Line.Extras} extras
// @property {Line.Item} item
// @property {Array<Line.Option>} options

// @class Line.Extras
// @property {String} shipaddress SCA specific
// @property {String} shipmethod SCA specific
// @property {Number} tax_rate SCA specific
// @property {String} rate_formatted SCA specific
// @property {Number} discount SCA specific
// @property {number} total SCA specific
// @property {String} amount_formatted SCA specific
// @property {String} tax_amount_formatted SCA specific
// @property {String} discount_formatted SCA specific
// @property {String} total_formatted SCA specific
// @property {String} description SCIS specific
// @property {String} giftcertfrom SCIS specific
// @property {String} giftcertmessage SCIS specific
// @property {Number} giftcertnumber SCIS specific
// @property {String} giftcertrecipientemail SCIS specific
// @property {String} giftcertrecipientname SCIS specific
// @property {String} taxrate1 SCIS specific
// @property {String} taxrate2 SCIS specific
// @property {String} grossamt SCIS specific
// @property {String} tax1amt SCIS specific
// @property {String} custreferralcode SCIS specific
// @property {Boolean} excludefromraterequest SCIS specific
// @property {String} custcol_ns_pos_voidqty SCIS specific
// @property {Number} voidPercentage SCIS specific
// @property {Number} returnedQuantity SCIS specific
// @property {Boolean} isUnvalidatedReturn SCIS specific
// @property {Boolean} order SCIS specific
// @property {String} note SCIS specific

// @class Line.Option
// @property {String} cartOptionId
// @property {{internalid:String}} value

// @class Line.Item
// @property {Number} internalid
// @property {String} itemid
// @property {String} displayname
// @property {Boolean} isinactive
// @property {String} itemtype
// @property {Number} minimumquantity
// @property {Line.Item.Extras} extras

// @class Line.Item.Extras
// @property {Boolean} isinstock SCA specific
// @property {Boolean} isonline SCA specific
// @property {Object} matrixchilditems_detail SCA specific
// @property {Boolean} ispurchasable SCA specific
// @property {String} stockdescription SCA specific
// @property {Boolean} isfulfillable SCA specific
// @property {Boolean} isbackorderable SCA specific
// @property {Boolean} showoutofstockmessage SCA specific
// @property {String} outofstockmessage SCA specific
// @property {String} storedisplayname2 SCA specific
// @property {Number} pricelevel1 SCA specific
// @property {String} pricelevel1_formatted SCA specific
// @property {String} urlcomponent SCA specific
// @property {Object} itemimages_detail SCA specific
// @property {Object} onlinecustomerprice_detail SCA specific
// @property {Object} itemoptions_detail SCA specific
// @property {String} type SCIS specific
// @property {String} baseprice SCIS specific
// @property {String} matrix_parent SCIS specific
// @property {String} upccode SCIS specific
// @property {String} additional_upcs SCIS specific
// @property {Boolean} isdonationitem SCIS specific
// @property {Boolean} custitem_ns_pos_physical_item SCIS specific

// @class Summary
// @property {Number} total
// @property {Number} taxtotal
// @property {Number} tax2total
// @property {Number} discounttotal
// @property {Number} subtotal
// @property {Number} shippingcost
// @property {Number} handlingcost
// @property {Number} giftcertapplied

// @property {String} discounttotal_formatted SCA specific
// @property {String} taxonshipping_formatted SCA specific
// @property {String} taxondiscount_formatted SCA specific
// @property {Number} itemcount SCA specific
// @property {String} taxonhandling_formatted SCA specific
// @property {Number} discountedsubtotal SCA specific
// @property {String} discountedsubtotal_formatted SCA specific
// @property {Number} taxondiscount SCA specific
// @property {String} handlingcost_formatted SCA specific
// @property {Number} taxonshipping SCA specific
// @property {String} taxtotal_formatted SCA specific
// @property {String} totalcombinedtaxes_formatted SCA specific
// @property {Number} totalcombinedtaxes SCA specific
// @property {String} giftcertapplied_formatted SCA specific
// @property {String} shippingcost_formatted SCA specific
// @property {Number} discountrate SCA specific
// @property {Number} taxonhandling SCA specific
// @property {String} tax2total_formatted SCA specific
// @property {String} discountrate_formatted SCA specific
// @property {Number} estimatedshipping SCA specific
// @property {String} estimatedshipping_formatted SCA specific
// @property {String} total_formatted SCA specific
// @property {String} subtotal_formatted SCA specific

// @property {String} shippingtax1rate SCIS specific
// @property {Boolean} shippingcostoverridden SCIS specific
// @property {Number} amountdue SCIS specific
// @property {String} tranid SCIS specific
// @property {Date} createddate SCIS specific
// @property {String} couponcode SCIS specific
// @property {Date} createdfrom SCIS specific
// @property {Number} changedue SCIS specific

// @class ConfirmationSubmit in SCA the object returned by getShoppingSession().getOrder().submit()
//@class FormattedObject
//@property {Object} extras additional properties unique to SCIS or SCA
