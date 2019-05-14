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
