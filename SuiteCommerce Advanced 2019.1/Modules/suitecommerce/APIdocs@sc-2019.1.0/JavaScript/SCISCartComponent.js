/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * Provides methods for manipulating cart's lines, summary, estimates, promotions, submit. It also expose cancelable events that will be triggered before and after lines, estimates, promotions, etc change. An instance of this component can obtained by calling `container.getComponent("cart")`.
 * @class
 * @extends VisualComponent
 * @global
 * @hideconstructor
 */
class CartComponent extends VisualComponent {

		constructor() {
			super()
		}

		/**
		 * Adds a new line into the cart. Returns a Deferred that is resolved into the added line id {@link String}, in the case the operation was done successfully, or rejected with an error message. Example:
		 *
		 * ```javascript
		 * 	container.getComponent('Cart').addLine({
		 * 		line: {
		 * 			quantity: 1,
		 * 			item: {
		 * 				internalid: 8058
		 * 			}
		 * 		}
		 * 	})
		 * .then(data=>alert('Item added'))
		 * .fail(error=>alert('There was an error adding the item'))
		 * ```
		 * @param {AddLine} data
		 * @return {Deferred}
		 */
		addLine(data) {
			return null
		}

		/**
		 * Adds new lines into the cart. Returns a Deferred that is resolved with the an array of line ids (Array of strings) into the added line id in the case the operation or rejected with an error message. See {@link CartComponent#addLine}
		 * @param {AddLines} lines
		 * @return {Deferred}
		 */
		addLines(lines) {
			return null
		}

		/**
		 * returns the lines of the cart as a  Deferred that is resolved in the case the operation was done successfully or the promise is rejected with an error message. The promise resolves with an array of {@link Line}
		 * @return {Deferred<Array<Line>>}
		 */
		getLines() {
			return null
		}

		/**
		 * Voids a line from the cart. Returns a Deferred that is resolved in the case the operation was done successfully or rejected with an error message.
		 * @param {{line_id: String}} data id of the line to void
		 * @return {Deferred}
		 */
		voidLine(data) {
			return null
		}

        /**
		 * Unvoids a line from the cart. Returns a Deferred that is resolved in the case the operation was done successfully or rejected with an error message.
		 * @param {{line_id: String}} data id of the line to unvoid
		 * @return {Deferred}
		 */
		unvoidLine(data) {
			return null
		}

		/**
		 * Updates a cart's line. Returns a Deferred that is resolved with {@link Line} in the case the operation was done successfully, or rejected with an error message.
		 * @param {Line} line
		 * @return {Deferred}
		 */
		updateLine(line) {
			return null
		}

		/**
		 * Returns the summary of the cart as a Deferred that is resolved with a {@link Summary} in the case the operation was done successfully or rejected with an error message.
		 * @return {Deferred}
		 */
		getSummary() {
			return null
		}

		/**
		 * Set a customer to the order. Returns a Deferred that is resolved with a {@link ConfirmationSetCustomer} object in the case the operation was done successfully, or rejected with an error message.
         * @param {{customer: {internalid: Int, name: String }}} data
		 * @return {Deferred}
		 */
		setCustomer(data) {
			return null
		}

		/**
		 * Mark a line marked to be returned in the cart. Return a jQuery Deferred that is resolved with an array of {@link Returned} in the case the operation was done successfully or the promise is rejected with an error message.
         * @param {{line_id : String}} data id of the line to be returned
		 * @return {Deferred}
		 */
		returnLine(data) {
			return null
		}

        /**
		 * Adds a line discount
         * @param {{line: String, id: String}} data line is an id of the line and id of the discount to be applied
		 * @return {Deferred}
		 */
		addLineDiscount(data) {
			return null
		}

        /**
		 * Remove a line discount
         * @param {{line: String}} data line is an id of the line to be removed the discount
		 * @return {Deferred}
		 */
		removeLineDiscount(data) {
			return null
		}

        /**
		 * Adds a global discount
		 * @param {{id: String}} data id is the identifier of the discount to be applied
		 */
		addGlobalDiscount(data) {
			return null
		}
		/**
		 * Adds a promotion
		 * @param {{promocode: String}} data the promocode to add
		 */
		addPromotion(data) {
			return null
		}

		/**
		 * Removes a promotion
		 * @param {{internalid: string}} data
		 * @return {Deferred}
		 * TODO: check param and deferred resolve with
		 */
		removePromotion(data) {
			return null
		}
	}


	//Events:


	/**
	 * Cancelable event triggered before a cart's line is updated. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeUpdateLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a cart's line is updated See
	 * TODO: type
	 * @event CartComponent#afterUpdateLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

     /**
 	 * Cancelable event triggered before a cart's line is voided. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeVoidLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

     /**
 	 * Cancelable event triggered after a cart's line is voided. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#afterVoidLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

     /**
 	 * Cancelable event triggered before a cart's line is unvoided. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeUnVoidLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

     /**
 	 * Cancelable event triggered after a cart's line is unvoided. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#afterUnVoidLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

     /**
 	 * Cancelable event triggered before a cart's customer is added. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeSetCustomer
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

 	/**
 	 * Triggered after a cart's customer is added
 	 * TODO: type
 	 * @event CartComponent#afterSetCustomer
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

	/**
	 * Cancelable event triggered before a global discount is added. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeAddGlobalDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a global discount is added
	 * TODO: type
	 * @event CartComponent#afterAddGlobalDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Cancelable event triggered before a global discount is removed. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeRemoveGlobalDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a global discount is removed
	 * TODO: type
	 * @event CartComponent#afterRemoveGlobalDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Cancelable event triggered before a cart's discount line is added. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeAddLineDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Cancelable event triggered after a cart's discount line is added. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#afterAddLineDiscount
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

     /**
 	 * Cancelable event triggered before a cart's discount line is removed. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeRemoveLineDiscount
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

 	/**
 	 * Cancelable event triggered after a cart's discount line is removed. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#afterRemoveLineDiscount
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

	/**
	 * Triggered before a global promotion is added to the cart. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeAddGlobalPromotion
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a global promotion is added to the cart
	 * TODO: type
	 * @event CartComponent#afterAddGlobalPromotion
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

     /**
 	 * Triggered before a global promotion is removed to the cart. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeRemoveGlobalPromotion
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

 	/**
 	 * Triggered after a global promotion is removed to the cart
 	 * TODO: type
 	 * @event CartComponent#afterRemoveGlobalPromotion
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

	/**
	 * Triggered before a line is returned from the cart. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeReturnLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a line is returned from the cart
	 * TODO: type
	 * @event CartComponent#afterReturnLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 *  Triggered before the order is submitted. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeSubmit
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after the order is submitted
	 * TODO: type
	 * @event CartComponent#afterSubmit
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

     /**
 	 *  Triggered before a gift card is added to the cart. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeAddGiftCard
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

 	/**
 	 * Triggered after a gift card is added to the cart
 	 * TODO: type
 	 * @event CartComponent#afterAddGiftCard
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

     /**
 	 * Triggered before a line is unreturned from the cart. See {@link CancelableEvents}
 	 * TODO: type
 	 * @event CartComponent#beforeUnReturnLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

 	/**
 	 * Triggered after a line is unreturned from the cart
 	 * TODO: type
 	 * @event CartComponent#afterUnReturnLine
 	 * @type {object}
 	 * @property {boolean} TODO TODO
 	 */

	/**
	 * Cancelable event triggered before adding a new cart's line. See {@link CancelableEvents}
	 * TODO: type
	 * @event CartComponent#beforeAddLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */

	/**
	 * Triggered after a new line is added in the cart
	 * TODO: type
	 * @event CartComponent#afterAddLine
	 * @type {object}
	 * @property {boolean} TODO TODO
	 */


	// Data types:

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


	 * @property {String} shippingtax1rate SCIS specific
	 * @property {Boolean} shippingcostoverridden SCIS specific
	 * @property {Number} amountdue SCIS specific
	 * @property {String} tranid SCIS specific
	 * @property {Date} createddate SCIS specific
	 * @property {String} couponcode SCIS specific
	 * @property {Date} createdfrom SCIS specific
	 * @property {Number} changedue SCIS specific
	 */
