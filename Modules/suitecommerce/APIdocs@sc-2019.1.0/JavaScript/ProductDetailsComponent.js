/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * The ProductDetailsComponent provides a number of ways to interact with the product details page (PDP), such as setting page options, changing quantities, and getting item information. Get an instance of this component by calling container.getComponent("PDP").
 * @extends VisualComponent
 * @hideconstructor
 * @global
 */
class ProductDetailsComponent extends VisualComponent {
  constructor () {
    super()

    /**
     * The name of the main PDP full view. Use this name to reference views in methods such as {@link addChildViews}, {@link addToViewContextDefinition}, and so on.
     * @type {String}
     */
    this.PDP_FULL_VIEW = 'ProductDetails.Full.View'

    /**
     * The name of the PDP quick view. Use this name to reference views in methods such as {@link addChildViews}, {@link addToViewContextDefinition}, and so on.
     * @type {String}
     */
    this.PDP_QUICK_VIEW = 'ProductDetails.QuickView.View'
  }

  /**
   * Sets an option of the current product details page. This method only works if the current view is a PDP.
   * @param {String} cart_option_id The identifier of the option.
   * @param {String} value Leaving the _value_ blank (or providing an invalid _value_) clears the option.
   * @return {Deferred<Boolean>} Returns a Deferred object. If the promise is resolved, it indicates the operation was successful. If the promise is rejected, it returns an error.
   * @fires ProductDetailsComponent#afterOptionSelection
   * @fires ProductDetailsComponent#beforeOptionSelection
   */
  setOption (cart_option_id, value) {
    return null
  }

  /**
   * Sets the quantity of the current product details page. This method only works if the current view is a PDP.
   * @param {Number} quantity
   * @return {Deferred} Returns a Deferred object. If the promise is resolved, it indicates the operation was successful. If the promise is rejected, it returns an error.
   * @fires ProductDetailsComponent#beforeQuantityChange
   * @fires ProductDetailsComponent#afterQuantityChange
   */
  setQuantity (quantity) {
    return null
  }

  /**
   * Gets information about the item in the current product details page (PDP). Item information can include the item quantity, shipping address, fulfillment choice, and so on. If the current view is not a PDP, it returns null.
   *
   * Note: Information might also include data from custom fields. 
   * @return {ItemInfo}
   */
  getItemInfo () {
    return null
  }

  /**
   * Gets the subitems of a matrix item according to the filters defined in matrix_options. If _matrix_options_ is set but empty, this method returns all subitems of the matrix item. If _matrix_options_ is null or undefined, this method returns the subitems of the current selection.
   * @param {MatrixOptionSelection} matrix_options The options by which to filter the subitems of the matrix item.
   * @return {Array<MatrixChild.ItemInfo>} Returns an array of all the subitems (of the matrix item) that match the _matrix_options_ filters.
   */
  getSelectedMatrixChilds (matrix_options) {
    return null
  }

  /**
   * Gets all the subitems of a matrix item.
   * @return {Array<MatrixChild.ItemInfo>} Returns an array of all the subitems of a matrix item.
   */
  getAllMatrixChilds () {
    return null
  }

  /**
   * Gets inventory-related information about an item. If the item is an inventory item, it returns the available quantity of the item. If the item is a matrix item and subitems are filtered (with {@link ProductDetailsComponent#getSelectedMatrixChilds}), it returns the sum of the available quantity of all the filtered subitems of the matrix item.
   * @return {Item.StockInfo}
   */
  getStockInfo () {
    return null
  }
}

// Events:

/**
 * Cancelable event triggered before an option is set. See {@link CancelableEvents}.
 * @event ProductDetailsComponent#beforeOptionSelection
 * @property {String} optionCartId The selected option id
 * @property {String} value The selected option value
 */

/**
 * Event triggered after an option is set.
 * @event ProductDetailsComponent#afterOptionSelection
 * @property {String} optionCartId The selected option id
 * @property {String} value the selected option value
 */

/**
 * Cancelable event triggered before the quantity is changed. See {@link CancelableEvents}.
 * @event ProductDetailsComponent#beforeQuantityChange
 * @type {number}
 */

/**
 * Event triggered after the quantity is changed.
 * @event ProductDetailsComponent#afterQuantityChange
 * @type {number}
 */

/**
 * Cancelable event triggered before the main image displayed on the product details page is changed. See {@link CancelableEvents}.
 * @event ProductDetailsComponent#beforeImageChange
 * @property {number} currentIndex
 * @property {number} nextIndex
 */

/**
 * Event triggered after the main image displayed on the product details page is changed.
 * @event ProductDetailsComponent#afterImageChange
 * @type {undefined}
 */

// Data types:

/**
 * Representation of the data objects used to send a transaction line representation to the back-end without sending all the heavy weight JSON that is not totally needed by the back-end
 * @typedef {Object} ItemInfo
 *
 * @property {String} internalid
 * @property {Number} [quantity]
 * @property {Array<Object>} [options]
 * @property {Number} [splitquantity]
 * @property {Number} [shipaddress]
 * @property {Number} [shipmethod]
 * @property {Number} [location]
 * @property {String} [fulfillmentChoice]
 * @property {*} [item]
 * @property {String} [item.internalid]
 * @property {String} [item.type]
 * @property {String} [item.onlinecustomerprice_detail]
 */

/**
 *  @typedef {Object} MatrixOptionSelection
 *
 * @property {String} custom_item_option
 * @property {String|Number} custom_item_option_value
 */

/**
 *  @typedef {Object} MatrixChild.ItemInfo
 *
 * @property {String} internalid
 * @property {String} custom_item_option??
 * @property {boolean} isbackorderable
 * @property {boolean} isinstock
 * @property {boolean} ispurchasable
 * @property {boolean} isstorepickupallowed
 * @property {String} itemid
 * @property {String} itemtype
 * @property {String} itemtype
 * @property {Array} options
 * @property {String} outofstockbehavior
 * @property {String} outofstockmessage
 * @property {Number} quantityavailable
 * @property {Location} quantityavailableforstorepickup_detail
 * @property {boolean} showoutofstockmessage
 * @property {String} stockdescription

 * @property {object} keyMapping_attributesRating
 * @property {array} keyMapping_attributesToRateOn
 * @property {Breadcrumb} [keyMapping_breadcrumb]
 * @property {Number} keyMapping_comparePriceAgainst
 * @property {String} keyMapping_comparePriceAgainstFormated
 * @property {String} keyMapping_correlatedItemsDetail
 * @property {String} keyMapping_id
 * @property {Image} [keyMapping_images]
 * @property {String} keyMapping_inStockMessage
 * @property {String} keyMapping_isBackorderable
 * @property {String} keyMapping_isInStock
 * @property {String} keyMapping_isPurchasable
 * @property {boolean} keyMapping_isReturnable
 * @property {boolean} keyMapping_isfulfillable
 * @property {boolean} keyMapping_isstorepickupallowed
 * @property {String} keyMapping_itemType
 * @property {String} keyMapping_keywords
 * @property {String} keyMapping_matrixChilds
 * @property {String} keyMapping_matrixParent
 * @property {String} keyMapping_metaTags
 * @property {Number} keyMapping_minimumQuantity
 * @property {String} keyMapping_name
 * @property {String} keyMapping_optionsDetails
 * @property {String} keyMapping_outOfStockMessage
 * @property {String} [keyMapping_pageHeader]
 * @property {String} [keyMapping_pageTitle]
 * @property {Number} keyMapping_price
 * @property {String} keyMapping_priceDetails
 * @property {String} keyMapping_price_formatted
 * @property {StorePickUpDetail} [keyMapping_quantityavailableforstorepickup_detail]
 * @property {Number} keyMapping_rating
 * @property {Number} keyMapping_ratingsCount
 * @property {object} keyMapping_ratingsCountsByRate
 * @property {String} keyMapping_relatedItems
 * @property {String} keyMapping_relatedItemsDetail
 * @property {boolean} keyMapping_showInStockMessage
 * @property {String} keyMapping_showOutOfStockMessage
 * @property {boolean} keyMapping_showQuantityAvailable
 * @property {boolean} keyMapping_showStockDescription
 * @property {String} keyMapping_sku
 * @property {String} keyMapping_stock
 * @property {String} keyMapping_stockDescription
 * @property {String} keyMapping_stockDescriptionClass
 * @property {*} keyMapping_thumbnail

 * @property {String} [keyMapping_thumbnail.url]
 * @property {String} [keyMapping_thumbnail.altimagetext]

 * @property {String} keyMapping_url
 * @property {*} onlinecustomerprice_detail

 * @property {String} [onlinecustomerprice_detail.onlinecustomerprice_formatted]
 * @property {Number} [onlinecustomerprice_detail.onlinecustomerprice]
 */

/**
 *  @typedef {Object} Breadcrumb
 *
 * @property {String} href
 * @property {String} text
 */

/**
 *  @typedef {Object} Image
 *
 * @property {String} altimagetext
 * @property {String} url
 */

/**
 *  @typedef {Object} StorePickUpDetail
 *
 * @property {Number} internalid
 * @property {Number} qtyavailableforstorepickup
 */

/**
 *  @typedef {Object} Item.StockInfo
 *
 * @property {Number} stock
 * @property {String} inStockMessage
 * @property {boolean} isAvailableForPickup
 * @property {boolean} isInStock
 * @property {boolean} isNotAvailableInStore
 * @property {String} outOfStockMessage
 * @property {boolean} showInStockMessage
 * @property {boolean} showQuantityAvailable
 * @property {boolean} showStockDescription
 * @property {String} stockDescription
 * @property {String} stockDescriptionClass
 * @property {StorePickUpDetail} [stockPerLocation]
 */
