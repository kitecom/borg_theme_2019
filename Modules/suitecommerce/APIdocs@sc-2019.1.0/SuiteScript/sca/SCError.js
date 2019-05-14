/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * SuiteScript backend errors are directly related to the errors returned from REST operations, including permission errors and SuiteScript errors. 
 * @class 
 * @global 
 * @hideconstructor
 */
class SCError extends Error {

	constructor() {
        super()
		/**
         * The HTTP status code of the error, for example, 404.
		 * @type {number} 
		 */
		this.status = null
		/**
         * The status code in string format, for example, "ERR_BAD_REQUEST".
		 * @type {String}
		 */
		this.code = null
		/**
		 * @type {string}
		 */
		this.message = null
    }
    
    get(){}
    put(){}
    post(){}
    delete(){}
    patch(){}
}
