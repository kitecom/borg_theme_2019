/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * The EnvironmentComponent class provides access to information about the SuiteCommerce environment, including information such as configuration details, site settings, and user session details. Information retrieved is read only; any changes made to the returned objects or data will not affect the original objects or data.
 * Get an instance of this component by calling `container.getComponent("Environment")`.
 *
 * @class
 * @extends BaseComponent
 * @global
 * @hideconstructor
 */
class EnvironmentComponent extends BaseComponent {

	/**
	 * Gets the value of a configuration key. If `key` is empty, the Configuration object is returned. Use dot notation to access child objects and properties, for example, `component.get('checkout.skipLogin')`. The getConfig method returns a copy of the original objects; any changes made to the retrieved object or key/value pair will not affect the original object.
	 * 
	 * @param {String} [key] The key you want to get the value of. 
	 * @return {any} Returns the value of the key, or the Configuration object if `key` is empty.
	 */
	getConfig(key) {
		return null
	}

	/**
	 * Checks whether the code is currently run by the SEO Page Generator or whether it is run by the web browser. See the [SEO Page Generator](https://system.netsuite.com/app/help/helpcenter.nl?fid=section_4053806622.html) topic in the NetSuite Help Center for more information.
	 * 
	 * @return {boolean} Returns `true` if the code is run by the SEO Page Generator; otherwise, it returns `false`.
	 */
	isPageGenerator() {
		return null
	}

	/**
	 * Gets the value of a key in the sitesettings JSON object. See {@link https://system.netsuite.com/app/help/helpcenter.nl?fid=section_N2532617.html|sitesettings} in the NetSuite Help Center for more information.
	 * 
	 * @param {String} [key]  The key you want to get the value of. Use dot notation to access child objects and properties. If `key` is empty, the sitesettings object is returned. 
	 * @return {any} Returns the value of the key, or the sitesettings object if `key` is empty.
	 */
	getSiteSetting(key) {
		return null
	}
	/**
	 * Gets information about the current session, such as currency, language, and price level.
	 * @return {Session}
	 */
	getSession() {
		return null
	}

	/**
	 * Adds or updates a translation key for a given locale. For example, `setTranslation('es_ES', [{key: 'Buy now', value: 'Comprar ahora'}])`. 
	 * @param {string} locale 
	 * @param {Array<TranslationEntry>} keys The keys and values of the translation to add or update.
	 */
	setTranslation(locale, keys) {
		return null
	}

}

/**
 * @typedef {Object} TranslationEntry
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef {Object} Session
 * @property {SessionCurrency} currency
 * @property {SessionLanguage} language
 * @property {SessionTouchpoints} touchpoints
 * @property {String} priceLevel
 */

/**
 * @typedef  {Object} SessionCurrency
 * @property {String} internalid
 * @property {String} symbol
 * @property {String} code
 * @property {String} name
 * @property {String} currencyname
 * @property {String} isdefault
 * @property {Number} symbolplacement
 */

/**
 * @typedef  {Object} SessionLanguage
 * @property {String} name
 * @property {String} isdefault
 * @property {String} locale
 * @property {String} languagename
 */

/**
 * @typedef  {Object} SessionTouchpoints
 * @property {String} logout
 * @property {String} customercenter
 * @property {String} serversync
 * @property {String} viewcart
 * @property {String} login
 * @property {String} welcome
 * @property {String} checkout
 * @property {String} continueshopping
 * @property {String} home
 * @property {String} register
 * @property {String} storelocator
 */