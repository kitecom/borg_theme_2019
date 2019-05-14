/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define(
	'ICart.Component'
	, [
		'SC.VisualComponent'
		, 'Application'
		, 'underscore'
	]
	, function (
		SCVisualComponent
		, Application
		, _
	)
	{
		'use strict';

		var ERROR_IDENTIFIERS = SCVisualComponent.ERROR_IDENTIFIERS

		// @function format formats An entity data grouping both commons attributes (SCIS and SCA) and non-commons. The last goes into the 'extras' key
		// @private
		// @param {Object} entity Data object to format
		// @param {Array<String>} commonAttrs Array with a string of all the common attributes that are at the first level of the returned formatted object
		// @return {Object} A Formatted object structured with all the unique properties inside the extra object
		, format = function format(entity, commonAttrs)
		{
			var formatted = {
				extras:
				{}
			};

			_.keys(entity).forEach(function (attr)
			{
				if (_.contains(commonAttrs, attr))
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

		// @class ICart.Component An abstract base class for front-end Cart component. Provides methods for manipulating cart's lines,
		// summary, estimates, promotions, submit. It also expose cancellable events that will be triggered before and after lines,
		// estimates, promotions, etc change.
		// @extends SC.BaseComponent
		// @public @extlayer
		, icart_component = _.extend(
			{}, SCVisualComponent
			, {

				componentName: 'Cart'

				// @method addLine Adds a new line into the cart
				// @public @extlayer
				// @param {Line} data
				// @return {Deferred<String>} Return a Deferred that is resolved into the added line id, String, in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, addLine: function addLine(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method addLines Adds new lines into the cart
				// @public @extlayer
				// @param {Array<Line>} data
				// @return {Deferred<Array<String>>} Return a Deferred that is resolved into the added lines ids, String, in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, addLines: function addLines(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getLines returns the lines of the cart
				// @public @extlayer
				// @return {Deferred<Array<Line>>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getLines: function getLines()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				//@method removeLine Removes a line from the cart
				//@public @extlayer
				//@param {String} line_id
				//@return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, removeLine: function removeLine(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method updateLine Updates a line into the cart
				// @public @extlayer
				// @param {Line} data
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, updateLine: function updateLine(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getSummary Returns the summary of the cart
				// @public @extlayer
				// @return {Deferred<Summary>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getSummary: function getSummary()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method submit Submits the order
				// @public @extlayer
				// @return {Deferred<ConfirmationSubmit>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, submit: function submit()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method addPayment Adds a payment method
				// @public @extlayer
				// @param {PaymentMethod} data
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, addPayment: function addPayment(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getPaymentMethods returns the payment methods added to the order
				// @public @extlayer
				// @return {Deferred<Array<PaymentMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getPaymentMethods: function getPaymentMethods()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method addPromotion Adds a promotion
				// @public @extlayer
				// @param {Promotion} data
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, addPromotion: function addPromotion(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method removePromotion Removes a promotion
				// @public @extlayer
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, removePromotion: function removePromotion(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getPromotions returns the promotions' codes added to the cart
				// @public @extlayer
				// @return {Deferred<Array<Promotion>>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getPromotions: function getPromotions()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method estimateShipping Returns the estimated shipping costs
				// @param {Address} data
				// @public @extlayer
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, estimateShipping: function estimateShipping(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method removeShipping Removes the shipping method
				// @public @extlayer
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, removeShipping: function removeShipping()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getShipAddress Returns the ship address of the order
				// @public @extlayer
				// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getShipAddress: function getShipAddress()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getBillAddress Returns the bill address of the order
				// @public @extlayer
				// @return {Deferred<Address>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getBillAddress: function getBillAddress()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method setShipAddress Sets the ship address
				// @param {String} address_id
				// @public @extlayer
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, setShipAddress: function setShipAddress(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method setBillAddress Sets the bill address
				// @param {String} address_id
				// @public @extlayer
				// @return {Deferred} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, setBillAddress: function setBillAddress(data)
				{
					//jshint unused:false
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getShipMethods Returns the ship methods of the order
				// @public @extlayer
				// @return {Deferred<Array<ShipMethod>>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getShipMethods: function getShipMethods()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method getShipMethod Returns the ship method of the order
				// @public @extlayer
				// @return {Deferred<ShipMethod>} Return a Deferred that is resolved in the case the operation was done successfully.
				// or the promise is rejected with an error message.
				, getShipMethod: function getShipMethod()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method voidLine Voids a line. Implemented only for SCIS
				// @public @extlayer
				, voidLine: function voidLine()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method unvoidLine Unvoids a line. Implemented only for SCIS
				// @public @extlayer
				, unvoidLine: function unvoidLine()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method updateCustomer Updates a customer data. Implemented only for SCIS
				// @public @extlayer
				, updateCustomer: function updateCustomer()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method clearEstimateShipping
				, clearEstimateShipping: function clearEstimateShipping()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method setCustomer Add a customer to the cart. Implemented only for SCIS
				// @public @extlayer
				, setCustomer: function setCustomer()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// @method returnLine. Return a line into the cart. Implemented only for SCIS
				// @public @extlayer
				, returnLine: function returnLine()
				{
					throw ERROR_IDENTIFIERS.notImplemented;
				}

				// updating tell us if the line is going to be used for updateLine
				, _validateLine: function _validateLine(data, updating)
				{
					// jshint unused:false

					if (!data || !_.isObject(data.line))
					{
						return this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain a line object');
					}
					//TODO call _reportError (code, description) when an invalid line is passed
				}

				, _validateLines: function _validateLines(data)
				{
					if (!data || !_.isArray(data.lines))
					{
						return this._reportError('INVALID_PARAM', 'Invalid parameter. It must be a valid object and must contain a lines array');
					}

					var self = this;

					_.map(data.lines, function (line)
					{
						self._validateLine(
						{
							line: line
						});
					});
				}

				, _validateLineId: function _validateLineId(data)
				{
					if (!data || !_.isString(data.line_id))
					{
						return this._reportError(
							'INVALID_PARAM'
							, 'Invalid parameter. It must be a valid object and must contain a line_id string'
						);
					}
				},

				_validateCustomer: function _validateCustomer(data)
				{
					// jshint unused:false

					if (!data || !_.isObject(data.customer))
					{
						return this._reportError(
							'INVALID_PARAM'
							, 'Invalid parameter. It must be a valid objec, must contain a customer object and customer must contain a customer_id string'
						);
					}
					// TODO call _reportError (code, description) when an invalid line is passed
				},

				_validatePromocode: function _validatePromocode(promocode)
				{
					if (!promocode)
					{
						return this._reportError(
							'INVALID_PARAM'
							, 'Invalid parameter. It must be a valid promocode, must contain a string.'
						);
					}
				},

				_validateInternalid: function _validateInternalid(internalid)
				{
					if (!internalid)
					{
						return this._reportError(
							'INVALID_PARAM'
							, 'Invalid parameter. It must be a valid internalid, must contain a string.'
						);
					}
				},

				// @method _normalizeLines formats each line grouping both commons attributes (SCIS and SCA) and non-commons.
				// The last into a extras named object.
				// @private
				// @param {Array<Line>} lines
				_normalizeLines: function _normalizeLines(src_lines)
				{
					var lines = _.deepCopy(src_lines);
					return _.map(lines, this._normalizeLine);
				}, // @method _normalizeLine formats the line grouping both commons attributes (SCIS and SCA) and non-commons.
				// The last into a extras named object.
				// @private
				// @param {Line} line
				_normalizeLine: function _normalizeLine(src_line)
				{
					var line = _.deepCopy(src_line)
						, commonLineAttrs = [
							'internalid'
							, 'item'
							, 'quantity'
							, 'amount'
							, 'rate'
							, 'tax_amount'
							, 'tax_code'
							, 'itemtype'
							, 'options'
						]
						, commonItemAttrs = [
							'internalid'
							, 'itemid'
							, 'displayname'
							, 'isinactive'
							, 'itemtype'
							, 'minimumquantity'
						];

					var formatted_line = format(line, commonLineAttrs);

					if (line.item)
					{
						line.item.itemtype = line.item.itemtype || line.item.type;
						formatted_line.item = format(line.item, commonItemAttrs);
					}

					return formatted_line;
				},

				_normalizeAddLineBefore: function _normalizeAddLineBefore(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeAddLineAfter: function _normalizeAddLineAfter(new_line, line)
				{
					return {
						result: new_line
						, line: this._normalizeLine(line)
					};
				},

				_normalizeUpdateLineBefore: function _normalizeUpdateLineBefore(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeUpdateLineAfter: function _normalizeUpdateLineAfter(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeRemoveLineBefore: function _normalizeUpdateLineBefore(line)
				{
					return {
						line_id: this._normalizeLine(line).internalid
					};
				},

				_normalizeRemoveLineAfter: function _normalizeUpdateLineBefore(line)
				{
					return {
						line_id: this._normalizeLine(line).internalid
					};
				},

				_normalizeSummary: function _normalizeSummary(inner_summary)
				{
					var summary = _.deepCopy(inner_summary)
						, commonSummaryAttrs = [
							'total'
							, 'taxtotal'
							, 'tax2total'
							, 'discounttotal'
							, 'subtotal'
							, 'shippingcost'
							, 'handlingcost'
							, 'giftcertapplied'
							, 'estimatedshipping'
						];

					return format(summary, commonSummaryAttrs);
				},

				_normalizeAddress: function _normalizeAddress(inner_address)
				{
					var address = _.deepCopy(inner_address)
						, commonAddressAttrs = [
							'internalid'
							, 'zip'
							, 'country'
							, 'addr1'
							, 'addr2'
							, 'addr3'
							, 'city'
							, 'company'
							, 'defaultbilling'
							, 'defaultshipping'
							, 'fullname'
							, 'isresidential'
							, 'isvalid'
							, 'phone'
							, 'state'
						];

					return format(address, commonAddressAttrs);
				},

				_normalizeEstimateBefore: function _normalizeEstimateBefore(address)
				{
					return {
						address: this._normalizeAddress(address)
					};
				},

				_normalizeEstimateAfter: function _normalizeEstimateAfter(order)
				{
					var address = _.find(order.addresses, function (address)
					{
						return address && address.internalid && address.internalid === order.shipaddress;
					});

					return {
						result: this._normalizeSummary(order.summary)
						, address: this._normalizeAddress(address)
					};
				},

				_normalizeClearEstimateShippingBefore: function _normalizeClearEstimateShippingBefore()
				{
					return {};
				},

				_normalizeClearEstimateShippingAfter: function _normalizeClearEstimateShippingAfter(order)
				{
					return this._normalizeEstimateAfter(order);
				},

				_normalizePromocode: function _normalizePromocode(promocode)
				{
					var promotion = _.deepCopy(promocode)
						, commonPromotionAttrs = [
							'internalid'
							, 'type'
							, 'name'
							, 'rate'
							, 'code'
							, 'errormsg'
							, 'isvalid'
						];

					return format(promotion, commonPromotionAttrs);
				},

				_normalizeShipMethod: function _normalizeShipMethod(inner_ship_method)
				{
					var ship_method = _.deepCopy(inner_ship_method)
						, commonShipMethodAttrs = ['internalid', 'name', 'rate', 'rate_formatted', 'shipcarrier'];

					return format(ship_method, commonShipMethodAttrs);
				},

				_normalizeConfirmation: function _normalizeConfirmation(inner_confirmation)
				{
					var confirmation = _.deepCopy(inner_confirmation)
						, commonConfirmationAttrs = [
							'internalid'
							, 'confirmationnumber'
							, 'lines'
							, 'paymentmethods'
							, 'promocodes'
							, 'reasoncode'
							, 'statuscode'
							, 'summary'
							, 'tranid'
						];

					confirmation.lines = this._normalizeLines(confirmation.lines || []);
					confirmation.paymentmethods = _.map(
						confirmation.paymentmethods || []
						, this._normalizePaymentMethod
					);
					confirmation.promocodes = _.map(confirmation.promocodes || [], this._normalizePromocode);
					confirmation.summary = this._normalizeSummary(confirmation.summary);

					return {
						confirmation: format(confirmation, commonConfirmationAttrs)
					};
				},

				_normalizePaymentMethod: function _normalizePaymentMethod(inner_payment_method)
				{
					if (_.isUndefined(inner_payment_method))
					{
						return {};
					}

					var payment_method = _.deepCopy(inner_payment_method);

					var commonPaymentMethodAttrs = [
							'internalid'
							, 'type'
							, 'creditcard'
							, 'key'
							, 'thankyouurl'
							, 'errorurl'
							, 'giftcertificate'
						]
						, commonCreditCardAttrs = [
							'ccnumber'
							, 'ccname'
							, 'ccexpiredate'
							, 'expmonth'
							, 'expyear'
							, 'ccsecuritycode'
							, 'paymentmethod'
						]
						, commonCreditCardPaymentAttrs = ['internalid', 'name', 'creditcard', 'ispaypal', 'key']
						, commonGiftCertificateAttrs = ['internalid', 'name', 'creditcard', 'ispaypal', 'key'];

					var formatted_payment_method = format(payment_method, commonPaymentMethodAttrs);

					if (payment_method.creditcard)
					{
						formatted_payment_method.creditcard = format(
							payment_method.creditcard
							, commonCreditCardAttrs
						);

						if (payment_method.creditcard.paymentmethod)
						{
							formatted_payment_method.creditcard.paymentmethod = format(
								payment_method.creditcard.paymentmethod
								, commonCreditCardPaymentAttrs
							);
						}
					}

					if (payment_method.giftcertificate)
					{
						formatted_payment_method.giftcertificate = format(
							payment_method.giftcertificate
							, commonGiftCertificateAttrs
						);
					}

					return {
						payment_method: formatted_payment_method
					};
				},

				_normalizeVoidLineBefore: function _normalizeVoidLineBefore(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeVoidLineAfter: function _normalizeVoidLineAfter(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeUnVoidLineBefore: function _normalizeUnVoidLineBefore(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeUnVoidLineAfter: function _normalizeUnVoidLineAfter(line)
				{
					return {
						line: this._normalizeLine(line)
					};
				},

				_normalizeSetCustomerBefore: function _normalizeSetCustomerBefore(customer)
				{
					return {
						customer: this._normalizeCustomer(customer)
					};
				},

				_normalizeSetCustomerAfter: function _normalizeSetCustomerAfter(customer)
				{
					return {
						customer: this._normalizeCustomer(customer)
					};
				},

				_normalizeCustomer: function _normalizeCustomer(inner_customer)
				{
					var customer = _.deepCopy(inner_customer)
						, commonCustomerAttrs = ['internalid', 'name'];

					return format(customer, commonCustomerAttrs);
				},

				// @method _normalizeAddGlobalDiscount formats each line grouping both commons attributes (SCIS and SCA) and non-commons.
				// The last into a extras named object.
				// @private
				// @param {Object} discount
				_normalizeGlobalDiscount: function _normalizeGlobalDiscount(discount)
				{
					var item = _.deepCopy(discount)
						, commonDiscountAttrs = ['id', 'rate', 'description'];

					return format(item, commonDiscountAttrs);
				},

				_normalizeLineDiscount: function _normalizeLineDiscount(discount)
				{
					var item = _.deepCopy(discount)
						, commonDiscountAttrs = ['discount', 'item'];

					return format(item, commonDiscountAttrs);
				},

				_normalizeGlobalPromotion: function _normalizeGlobalPromotion(promotion)
				{
					var item = _.deepCopy(_.last(promotion))
						, commonPromoAttrs = ['internalid', 'couponcode', 'toApply'];

					return format(item, commonPromoAttrs);
				}
				, _normalizeAddGlobalPromotionAfter: function _normalizeAddGlobalPromotionAfter(promotions)
				{
					var promotion = _.deepCopy(_.last(promotions))
						, commonPromoAttrs = ['internalid', 'couponcode', 'discountrate'];

					return format(promotion, commonPromoAttrs);
				}
				, _normalizeReturnLines: function _normalizeReturnLines(src)
				{
					var lines = [];

					if (!_.isArray(src))
					{
						lines.push(src);
					}
					else
					{
						lines = _.deepCopy(src);
					}

					return _.map(lines, this._normalizeReturnLine);
				}

				, _normalizeReturnLine: function _normalizeReturnLine(src_line)
				{

					var returned_line = _.deepCopy(src_line)
						, commonReturnLineAttrs = [
							'line'
							, 'item'
							, 'quantity'
							, 'returnedQuantity'
							, 'return_reason'
						]
						, commonItemAttrs = [
							'internalid'
							, 'itemid'
							, 'displayname'
							, 'isinactive'
							, 'itemtype'
							, 'minimumquantity'
						];

					var formatted_returned_line = format(returned_line, commonReturnLineAttrs);

					if (returned_line.item)
					{
						formatted_returned_line.item = format(returned_line.item, commonItemAttrs);
					}

					return {
						returned_line: formatted_returned_line
					};
				}

				, _normalizeUnReturnLine: function _normalizeUnReturnLine(src_line)
				{
					return {
						unreturned_line_number: src_line
					};
				}

				, _normalizeAddGiftCard: function _normalizeAddGiftCard(src)
				{

					var gift_card = _.deepCopy(src)
						, commonAttrs = [
							'cert_number'
							, 'amount'
						];

					return {
						gift_card: format(gift_card, commonAttrs)
					};
				}
			});

		return icart_component;
	});


// jsdoc description for data:

// @class ConfirmationSubmit
// @property {String} internalid
// @property {String} confirmationnumber
// @property {Array<Line>} lines
// @property {Array<PaymentMethod>} paymentmethods
// @property {Array<Promotion>} promocodes
// @property {String} reasoncode
// @property {String} statuscode
// @property {Summary} summary
// @property {String} tranid

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
// @property {String} phone
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

// @class Promotion
// @property {String} internalid
// @property {String} type
// @property {String} name
// @property {String} rate
// @property {String} code
// @property {String} errormsg
// @property {Boolean} isvalid

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
// @property {internalid:String} value

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
// @property {Number} estimatedshipping SCA specific
// @property {Summary.Extras} extras

// @class Summary.Extras
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

// @class Customer
// @property {String} internalid
// @property {String} name