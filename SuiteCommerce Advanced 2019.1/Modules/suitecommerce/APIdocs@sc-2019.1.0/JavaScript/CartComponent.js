/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * The CartComponent provides ways to work with the cart, for example, adding lines, getting the cart summary, and applying promotions. It also exposes before and after events for several methods, for example, beforeAddLine and afterAddLine.
 * 
 * Get an instance of this component by calling `container.getComponent("cart")`.
 * @class
 * @extends VisualComponent
 * @global
 * @hideconstructor
 */
class CartComponent extends VisualComponent {
	
		constructor() {
			super()
			/**
			 * Name of the cart main view. Please use this name to reference views in methods like {@link addChildView}, {@link addToViewContextDefinition}, etc
			 * @type {String}
			 */
			this.CART_VIEW = ''
	
			/**
			 * Name of the mini-cart main. Please use this name to reference views in methods like {@link addChildView}, {@link addToViewContextDefinition}, etc
			 * @type {String}
			 */
			this.CART_MINI_VIEW = ''
	
			/**
			 * @type {String}
			 */
			this.WIZARD_VIEW = ''
		}
	
		/**
		 * Adds a line to the cart. 
		 * 
		 * ```javascript
		 * 	container.getComponent('Cart').addLine({
		 * 		line: {
		 * 			quantity: 1, 
		 * 			item: {
		 * 				internalid: 8058
		 * 			}
		 * 		}
		 * 	}).then(()=>{alert(Utils.translate('Item added.'))})
		 * ```
		 * @param {AddLine} data
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, the line is added to the cart.
		 */
		addLine(data) {
			return null
		}
	
		/**
		 * Adds multiple lines to the cart.
		 * @param {AddLines} lines
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, the lines are added to the cart. See {@link CartComponent#addLine}.
		 */
		addLines(lines) {
			return null
		}
	
		/**
		 * Gets the lines in the cart. 
		 * @return {Deferred<Array<Line>>} Returns a Deferred object. If the promise is resolved, it returns the lines in the cart (an array of {@link Line}). Otherwise, the promise returns the rejected state.
		 */
		getLines() {
			return null
		}
	
		/**
		 * Removes a line from the cart. Returns a Deferred object in the resolved state if it was successful, or the rejected state if it failed.
		 * @param {String} internalid The ID of the line to remove.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it indicates the operation was successful.
		 */
		removeLine(internalid) {
			return null
		}
	
		/**
		 * Updates a line in the cart.
		 * @param {Line} line
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns the {@link Line}. Otherwise, the promise returns the rejected state.
		 */
		updateLine(line) {
			return null
		}
	
		/**
		 * Gets a summary of the cart.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns a {@link Summary}. If the promise is rejected, it returns an error.
		 */
		getSummary() {
			return null
		}
	
		/**
		 * Submits the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns a {@link ConfirmationSubmit}. If the promise is rejected, it returns an error.
		 */
		submit() {
			return null
		}
	
		/**
		 * Adds a payment method.
		 * @param {PaymentMethod} data
		 */
		addPayment(data) {
			return null
		}
	
		/**
		 * Gets the payment methods on the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns an array of {@link PaymentMethod}. If the promise is rejected, it returns an error.
		 */
		getPaymentMethods() {
			return null
		}
	
		/**
		 * Applies a promotion to the cart.
		 * @param {{promocode: String}} The promotion code (promocode) of the promotion.
		 */
		addPromotion(data) {
			return null
		}
	
		/**
		 * Removes a promotion from the cart.
		 * @param {{promocode_internalid: string}} data
		 * @return {Deferred}
		 */
		removePromotion(data) {
			return null
		}
	
	
		/**
		 * Gets the promotions (promotion codes) in the cart.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns an array of {@link Promotion}. If the promise is rejected, it returns an error.
		 */
		getPromotions() {
			return null
		}
	
		/**
		 * Gets the estimated shipping costs.
		 * @param {{zip: string, country: string}} locationData The postcode and country.
		*/
		estimateShipping(locationData) {
			return null
		}
	
		/**
		 * Removes the shipping method from the order.
		 */
		removeShipping() {
			return null
		}
	
		/**
		 * Clears the shipping estimation from the order.
		 */
		clearEstimateShipping() {
			return null
		}
	
		/**
		 * Gets all addresses of the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns an array of {@link Address}. If the promise is rejected, it returns an error.
		 */
		getAddresses() {
			return null
		}
	
		/**
		 * Gets the shipping address of the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns a {@link Address}. If the promise is rejected, it returns an error.
		 */
		getShipAddress() {
			return null
		}
		/**
		 * Gets the billing address of the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns a {@link Address}. If the promise is rejected, it returns an error.
		 */
		getBillAddress() {
			return null
		}
		/**
		 * Gets the shipping methods of the order.
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns an array of {@link ShipMethod}. If the promise is rejected, it returns an error.
		 */
		getShipMethods() {
			return null
		}
		/**
		 * Returns the selected shipping method of the order
		 * @return {Deferred} Returns a Deferred object. If the promise is resolved, it returns a {@link ShipMethod}. If the promise is rejected, it returns an error.
		 */
		getShipMethod() {
			return null
		}
	
	
	
		/**
		 * Voids a line. Implemented only for SCIS
		 */
		voidLine() {
			return null
		}
	
		/**
		 * Un-voids a line. Implemented only for SCIS
		 */
		unvoidLine() {
			return null
		}
	
		/**
		 * Updates a customer data. Implemented only for SCIS
		 */
		updateCustomer() {
			return null
		}
	
	}
	
	
	//Events:
	
	
	/**
	 * Cancelable event triggered before a line in the cart is updated. See {@link CancelableEvents}.
	 * @event CartComponent#beforeUpdateLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after a line in the cart is updated.
	 * @event CartComponent#afterUpdateLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before a line in the cart is removed. See {@link CancelableEvents}.
	 * @event CartComponent#beforeRemoveLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	
	/**
	 * Event triggered after a line in the cart is removed.
	 * @event CartComponent#afterRemoveLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before getting shipping esimates for the cart. See {@link CancelableEvents}.
	 * @event CartComponent#beforeEstimateShipping
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after shipping estimates retrieved.
	 * @event CartComponent#afterEstimateShipping
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before clearing shipping estimates for the cart. See {@link CancelableEvents}.
	 * @event CartComponent#beforeClearEstimateShipping
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after shipping estimates are cleared.
	 * @event CartComponent#afterClearEstimateShipping
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before a promotion is applied to the cart. See {@link CancelableEvents}.
	 * @event CartComponent#beforeAddPromotion
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after a promotion is applied to the cart.
	 * @event CartComponent#afterAddPromotion
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before a promotion is removed from the cart. See {@link CancelableEvents}.
	 * @event CartComponent#beforeRemovePromotion
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after a promotion is removed fromt the cart.
	 * @event CartComponent#afterRemovePromotion
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before a payment method is added to the order. See {@link CancelableEvents}.
	 * @event CartComponent#beforeAddPayment
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after a payment method is added to the order.
	 * @event CartComponent#afterAddPayment
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before the order is submitted. See {@link CancelableEvents}.
	 * @event CartComponent#beforeSubmit
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after the order is submitted.
	 * @event CartComponent#afterSubmit
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Cancelable event triggered before a line is added to the cart. See {@link CancelableEvents}.
	 * @event CartComponent#beforeAddLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	/**
	 * Event triggered after a line is added to the cart.
	 * @event CartComponent#afterAddLine
	 * @type {object}
	 * @property {boolean} .
	 */
	
	
	// Data types:
	
	/**
	 * This is the representation of Promotion objects for methods liks {@link addPromotion}, {@link getPromotions} etc
	 * @typedef {Object} Promotion
	 * @property {String} [internalid]
	 * @property {String} type
	 * @property {String} name
	 * @property {String} rate
	 * @property {String} code
	 * @property {String} errormsg
	 * @property {Boolean} isvalid
	 */
	
	/**
	 * Data type for adding new lines to the cart
	 * @typedef {Object} AddLine
	 * @property {Line} line
	 */
	
	/**
	 * Data type for adding new lines to the cart
	 * @typedef {Object} AddLines
	 * @property {Array<Line>} lines
	 */
	
	/**
	 * This is the representation of the cart's line objects with you call {@link addLine}, {@link getLine}, etc
	 * @typedef {Object} Line
	 * @property {String} [internalid]
	 * @property {Number} [quantity]
	 * @property {Number} [amount]
	 * @property {Number} [rate]
	 * @property {Number} [tax_amount]
	 * @property {String} [tax_code]
	 * @property {String} [itemtype]
	 * @property {*} [item]
	 *
	 * @property {Number} item.internalid
	 * @property {String} [item.itemid]
	 * @property {String} [item.displayname]
	 * @property {Boolean} [item.isinactive]
	 * @property {String} [item.itemtype]
	 * @property {Number} [item.minimumquantity]
	 *
	 * @property {Array<LineOption>} [options]
	 * 
	 * @property {*} [extras]
	 * 
	 * @property {String} [extras.shipaddress] SCA specific
	 * @property {String} [extras.shipmethod] SCA specific
	 * @property {Number} [extras.tax_rate] SCA specific
	 * @property {String} [extras.rate_formatted] SCA specific
	 * @property {Number} [extras.discount] SCA specific
	 * @property {number} [extras.total] SCA specific
	 * @property {String} [extras.amount_formatted] SCA specific
	 * @property {String} [extras.tax_amount_formatted] SCA specific
	 * @property {String} [extras.discount_formatted] SCA specific
	 * @property {String} [extras.total_formatted] SCA specific
	 * @property {String} [extras.description] SCIS specific
	 * @property {String} [extras.giftcertfrom] SCIS specific
	 * @property {String} [extras.giftcertmessage] SCIS specific
	 * @property {Number} [extras.giftcertnumber] SCIS specific
	 * @property {String} [extras.giftcertrecipientemail] SCIS specific
	 * @property {String} [extras.giftcertrecipientname] SCIS specific
	 * @property {String} [extras.taxrate1] SCIS specific
	 * @property {String} [extras.taxrate2] SCIS specific
	 * @property {String} [extras.grossamt] SCIS specific
	 * @property {String} [extras.tax1amt] SCIS specific
	 * @property {String} [extras.custreferralcode] SCIS specific
	 * @property {Boolean} [extras.excludefromraterequest] SCIS specific
	 * @property {String} [extras.custcol_ns_pos_voidqty] SCIS specific
	 * @property {Number} [extras.voidPercentage] SCIS specific
	 * @property {Number} [extras.returnedQuantity] SCIS specific
	 * @property {Boolean} [extras.isUnvalidatedReturn] SCIS specific
	 * @property {Boolean} [extras.order] SCIS specific
	 * @property {String} [extras.note] SCIS specific
	
	 */
	
	
	/**
	 * This is the representation of the line's option in the  {@link Line} type
	 * @typedef {Object} LineOption
	 * @property {String} cartOptionId
	 * @property {{internalid:String}} value an object with a String property *internalid*
	 */
	
	
	
	
	
	
	
	
	
	/**
	 * This is the representation of the cart's summary returned by  {@link getSummary},  etc
	 * @typedef {Object} Summary
	 * @property {Number} [total]
	 * @property {Number} [taxtotal]
	 * @property {Number} [tax2total]
	 * @property {Number} [discounttotal]
	 * @property {Number} [subtotal]
	 * @property {Number} [shippingcost]
	 * @property {Number} [handlingcost]
	 * @property {Number} [giftcertapplied]
	
	 * @property {String} [discounttotal_formatted] SCA specific
	 * @property {String} [taxonshipping_formatted] SCA specific
	 * @property {String} [taxondiscount_formatted] SCA specific
	 * @property {Number} [itemcount] SCA specific
	 * @property {String} [taxonhandling_formatted] SCA specific
	 * @property {Number} [discountedsubtotal] SCA specific
	 * @property {String} [discountedsubtotal_formatted] SCA specific
	 * @property {Number} [taxondiscount] SCA specific
	 * @property {String} [handlingcost_formatted] SCA specific
	 * @property {Number} [taxonshipping] SCA specific
	 * @property {String} [taxtotal_formatted] SCA specific
	 * @property {String} [totalcombinedtaxes_formatted] SCA specific
	 * @property {Number} [totalcombinedtaxes] SCA specific
	 * @property {String} [giftcertapplied_formatted] SCA specific
	 * @property {String} [shippingcost_formatted] SCA specific
	 * @property {Number} [discountrate] SCA specific
	 * @property {Number} [taxonhandling] SCA specific
	 * @property {String} [tax2total_formatted] SCA specific
	 * @property {String} [discountrate_formatted] SCA specific
	 * @property {Number} [estimatedshipping] SCA specific
	 * @property {String} [estimatedshipping_formatted] SCA specific
	 * @property {String} [total_formatted] SCA specific
	 * @property {String} [subtotal_formatted] SCA specific
	
	 * @property {String} shippingtax1rate SCIS specific
	 * @property {Boolean} shippingcostoverridden SCIS specific
	 * @property {Number} amountdue SCIS specific
	 * @property {String} tranid SCIS specific
	 * @property {Date} createddate SCIS specific
	 * @property {String} couponcode SCIS specific
	 * @property {Date} createdfrom SCIS specific
	 * @property {Number} changedue SCIS specific
	 */
	
	
	
	/**
	 * in SCA the object returned by getShoppingSession().getOrder().submit()
	 * @typedef {Object} ConfirmationSubmit
	 */
	
	
	
	/**
	 * This is the representation an address
	 * @typedef {Object} Address
	 * @property {String} internalid
	 * @property {String} zip
	 * @property {String} country
	 * @property {String} addr1
	 * @property {String} addr2
	 * @property {String} addr3
	 * @property {String} city
	 * @property {String} company
	 * @property {Boolean} defaultbilling
	 * @property {Boolean} defaultshipping
	 * @property {String} fullname
	 * @property {Boolean} isresidential
	 * @property {Boolean} isvalid
	 * @property {String} phone
	 * @property {String} state
	 */
	
	/**
	 * This is the representation of a shipping method
	 * @typedef {Object} ShipMethod
	 * @property {String} internalid
	 * @property {String} name
	 * @property {Number} rate
	 * @property {String} rate_formatted
	 * @property {String} shipcarrier
	 */
	
	/**
	 * This is the representation of a shipping method
	 * @typedef {Object} PaymentMethod
	 * @property {String} internalid
	 * @property {String} type valid options: [creditcard, invoice, paypal, giftcertificate, external_checkout]
	 * @property {CreditCard} creditcard Required only if it is a creditcard
	
	 * @property {String} creditcard.ccnumber Required only if it is a creditcard
	 * @property {String} creditcard.ccname Required only if it is a creditcard
	 * @property {String} creditcard.ccexpiredate Required only if it is a creditcard
	 * @property {String} creditcard.expmonth Required only if it is a creditcard
	 * @property {String} creditcard.expyear Required only if it is a creditcard
	 * @property {String} creditcard.ccsecuritycode Required only if it is a creditcard
	
	 * @property {String} creditcard.paymentmethod.internalid
	 * @property {String} creditcard.paymentmethod.name
	 * @property {Boolean} creditcard.paymentmethod.creditcard
	 * @property {Boolean} creditcard.paymentmethod.ispaypal
	 * @property {String} creditcard.paymentmethod.key
	
	 * @property {String} key
	 * @property {String} thankyouurl
	 * @property {String} errorurl
	 * @property {String} giftcertificate.code Required only if it is a giftcertificate
	
	 */
	