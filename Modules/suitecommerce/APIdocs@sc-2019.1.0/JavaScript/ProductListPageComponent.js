/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * The ProductListPage (PLP) component provides ways to work with the product list page, for example, by setting display options, pagination, filters, and sorting. Some methods will only work when the current view is the search page.
 *
 * Get an instance of this component by calling `container.getComponent("PLP")`.
 * @extends VisualComponent
 * @hideconstructor
 * @global
 */
class ProductListPageComponent extends VisualComponent {

    constructor() {
        super()
		/**
		 * The name of the main view (Facets.Browse.View) of the PLP component. Use this to refer to view in methods such as {@link addChildViews}, {@link addToViewContextDefinition}, and so on.
		 * @type {String}
		 */
        this.PLP_VIEW = 'facet-browse'
    }

    /**
     * Gets information about the current options applied in the product list page. Use only after the search page has rendered (by subscribing to the afterShowContent event).
     * 
     * EXAMPLE
     * ```javascript
     * var plp = container.getComponent('PLP');
     * plp.on("afterShowContent", function()
     * {
     *     plp.getPagination();
     * });
     * ```
     * @return {Pagination}
     */
    getPagination() {
        return null
    }

    /**
     * Navigates to the specified page. This method works only when the current view is the search page. Pages use a zero-based index, so the first page is "0".
     * EXAMPLE
     * ```javascript
     * var plp = container.getComponent('PLP');
     * plp.setCurrentPage({currentPage: 2});
     * ```
     * @param {number} page
     * @return {Deferred} 
     */
    setCurrentPage(page) {
        return null
    }

    /**
     * Gets information about the current sorting options. This method works only when the current view is the search page.
     * @return {Sorting} Returns a Sorting object, or null if the current page is not the search page.
     */
    getSorting() {
        return null
    }

    /**
     * Gets information about all sorting options. This method works only when the current view is the search page.
     * @return {Array<Sorting>} Returns an array of Sorting objects.
     */
    getAllSorting() {
        return null
    }

    /**
     * Sets the sorting options of the current search page. This method works only when the current view is the search page.
     * @param {Sorting} 
     * @return {Deferred} Returns a Deferred object. If the promise is resolved, but the current page is not the search page or an error occurs, it returns false.
     */
    setSorting(sorting) {
        return null
    }

    /**
     * Gets information about the current display options. This method works only when the current view is the search page.
     * @return {Display}
     */
    getDisplay() {
        return null
    }

    /**
     * Gets information about all display options, including the current display options. This method works only when the current view is the search page.
     * @return {Array<Display>}
     */
    getAllDisplay() {
        return null
    }

    /**
     * Sets the display options of the product list page. This method works only when the current view is the search page.
     * @param {Display} options
     * @return {Deferred} Returns a Deferred object. If the promise is resolved, but the current page is not the search page or an error occurs, it returns false.
     */
    setDisplay(options) {
        return null
    }

    /**
     * Gets the number of items on the current page. This method works only when the current view is the search page.
     * @return {PageSize}
     */
    getPageSize() {
        return null
    }


    /**
     * Gets the number of items on all pages. This method works only when the current view is the search page.
     * @return {Array<PageSize>}
     */
    getAllPageSize() {
        return null
    }

    /**
     * Sets the number of items to display on the page. This method works only when the current view is the search page.
     * @param {PageSize} options
     * @return {Deferred} Returns a Deferred object.  If the promise is resolved, but the current page is not the search page or an error occurs, it returns false.
     */
    setPageSize(options) {
        return null
    }

    /**
     * Gets information about the filters currently applied on the search page. This method works only when the current view is the search page.
     * @return {Array<Filter>}
     */
    getFilters() {
        return null
    }

    /**
     * Gets information about all filters, one of which is active. This method works only when the current view is the search page.
     * @return {Array<Filter>}
     */
    getAllFilters() {
        return null
    }

    /**
     * Sets the filters on the product list page.
     * @param {Array<Filter>} filters
     * @return {Deferred} Returns a Deferred object. If the promise is resolved, but the current page is not the search page or an error occurs, it returns false.
     */
    setFilters(filters) {
        return null
    }

    /**
     * Gets the current text search query on the search page. If the current page is not the search page, it returns null.
     * @return {String|null}
     */
    getSearchText() {
        return null
    }

    /**
     * Performs a search on the current search page with the keywords provided.
     * @param {{keywords: String}} options
     * @return {Deferred} Returns a Deferred object. If the promise is resolved, but the current page is not the search page or an error occurs, it returns false.
     */
    setSearchText(options) {
        return null
    }

    /**
     * Gets information about all items on the product list page.
     * @return {Array<SearchItemInfo>}
     */
    getItemsInfo() {
        return null
    }

    /**
     * Gets information about the current category.
     * @return {Object}
     */
    getCategoryInfo() {
    	return null
    }

    /**
     * Gets the Search API URL with the filters defined in the Facets view (such as page size or display). To ensure the URL is correctly formed for the current filters, sorting, and pagination, pass a Pagination object as an argument. For example, `plp.getUrl(plp.getPagination())`.
     * @return {String} 
     */
    getURL() {
    	return null
    }

}


/**
 * @typedef {Object} Filter
 * @property {String} id
 * @property {String} url
 * @property {String} value
 * @property {Boolean} active
 * @property  {Object} config
 * @property {String} config.id
 * @property {String} config.name
 * @property {String} config.url
 * @property {String} config.behavior
 * @property {Number} config.max
 * @property {String} config.titleToken
 */


/**
 * @typedef {Object} PageSize
 * @property {Number} items
 * @property {String} name
 * @property {Boolean} isDefault
 * @property {String} id
 * @property {Boolean} active
 */


/**
 * @typedef {Object} Display
 * @property {String} id
 * @property {String} name
 * @property {String} template
 * @property {Number} columns
 * @property {String} icon
 * @property {Boolean} isDefault
 * @property {Boolean} active
 */


/**
 * @typedef {Object} Sorting
 * @property {String} id
 * @property {String} name
 * @property {Boolean} isDefault
 * @property {Boolean} [active]
 */

/**
 * @typedef  {Object} Pagination
 * @property {Number} currentPage
 * @property {Number} pageCount
 * @property {Number} itemCount
 * @property {Number} pageSize
 * @property {String} sorting
 * @property {String} display
 * @property {Object} filters
 * @property {String} searchText
 */








/**
 * @typedef  {Object} SearchItemInfo
 * @property {Boolean} [isinstock]
 * @property {Number} [onlinecustomerprice]
 * @property {matrixchilditems_detail[]} [matrixchilditems_detail]
 * @property {String} [itemid]
 * @property {Boolean} [ispurchasable]
 * @property {String} [onlinecustomerprice_formatted]
 * @property {String} [stockdescription]
 * @property {Boolean} [isbackorderable]
 * @property {Object} [itemimages_detail]
 * @property {onlinecustomerprice_detail} [onlinecustomerprice_detail]
 * @property {String} [custitem_automation_item_field_001]
 * @property {String} [onlinematrixpricerange]
 * @property {Number} [internalid]
 * @property {Boolean} [showoutofstockmessage]
 * @property {String} [outofstockbehavior]
 * @property {String} [custitem_automation_item_field_002]
 * @property {itemoptions_detail} [itemoptions_detail]
 * @property {String} [outofstockmessage]
 * @property {String} [displayname]
 * @property {String} [storedisplayname2]
 * @property {String} [storedescription]
 * @property {String} [urlcomponent]
 * @property {SearchItemInfo_options[]} [options]
 */
/**
 * @typedef  {Object} matrixchilditems_detail
 * @property {Boolean} [isinstock]
 * @property {String} [itemid]
 * @property {Boolean} [ispurchasable]
 * @property {String} [stockdescription]
 * @property {Boolean} [isbackorderable]
 * @property {onlinecustomerprice_detail} [onlinecustomerprice_detail]
 * @property {Number} [internalid]
 * @property {Boolean} [showoutofstockmessage]
 * @property {String} [outofstockbehavior]
 * @property {String} [itemtype]
 * @property {String} [outofstockmessage]
 */
/**
 * @typedef  {Object} onlinecustomerprice_detail
 * @property {String} [onlinecustomerprice_formatted]
 * @property {Number} [onlinecustomerprice]
 */
/**
 * @typedef  {Object} itemimages_detail
 * @property {itemimages_detail_urls[]} [urls]
 */
/**
 * @typedef  {Object} itemimages_detail_urls
 * @property {String} [altimagetext]
 * @property {String} [url]
 */
/**
 * @typedef  {Object} itemoptions_detail
 * @property {String} matrixtype
 * @property {itemoptions_detail_fields[]} fields
 */
/**
 * @typedef  {Object} itemoptions_detail_fields
 * @property {Boolean} [ismandatory]
 * @property {String} [internalid]
 * @property {Boolean} [ismatrixdimension]
 * @property {itemoptions_detail_fields_values[]} [values]
 * @property {String} [label]
 * @property {String} [type]
 * @property {String} [sourcefrom]
 */
/**
 * @typedef  {Object} itemoptions_detail_fields_values
 * @property {String} [label]
 * @property {Boolean} [isAvailable]
 * @property {String} [url]
 */
/**
 * @typedef  {Object} SearchItemInfo_options
 * @property {String} label
 * @property {SearchItemInfo_options_values[]} values
 * @property {String} type
 * @property {String} cartOptionId
 * @property {String} itemOptionId
 * @property {Boolean} isMatrixDimension
 * @property {Boolean} isMandatory
 * @property {String} urlParameterName
 * @property {Boolean} useLabelsOnUrl
 * @property {Number} index
 */
/**
 * @typedef  {Object} SearchItemInfo_options_values instance
 * @property {String} label
 * @property {Boolean} isAvailable
 * @property {String} url
 */

