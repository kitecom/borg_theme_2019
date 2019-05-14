// @ts-check

/**
 * In the SuiteCommerce Extensibility API, the Deferred object is based on the {@link http://api.jquery.com/jQuery.Deferred/|JQuery Deferred} object. It is safe to require JQuery by its AMD name "JQuery" and instantiate a Deferred object.
 * 
 * ``` javascript
 * define('MyExtension', ['jQuery'], function(jQuery) {
 *   var promise = jQuery.Deferred();
 * })
 * ```
 * 
 * @class
 * @global
 * @hideconstructor
 * @template T Indicates the type of object passed to resolvedCallbacks and doneCallbacks.
 */
class Deferred {

	/**
	 * Rejects a Deferred object and calls any failCallbacks with the given arguments.
	 * @param {Object} args Optional arguments that are passed to the failCallbacks.
	 * @return {Deferred}
	 */
	reject() {
		return null
	}

	/**
	 * Returns a Promise object.
	 * @return {Deferred}
	 */
	promise() {
		return null
	}

	/**
	 * Calls the progressCallbacks on a Deferred object with the given arguments.
	 * @param {Object} args Optional arguments that are passed to the progressCallbacks.
	 * @return {Deferred}
	 */
	notify(args) {
		return null
	}

	/**
	 * Adds handlers to be called when the Deferred object is rejected.
	 * This method accepts one or more arguments, all of which can be either a single function or an array of functions. When the Deferred is rejected, the failCallbacks are called.
	 * @param {(Function|Function[])} failCallbacks
	 * @return {Deferred}
	 */
	fail(failCallbacks) {
		return this
	}


	/**
	 * Determines the current state of a Deferred object.
	 * @returns {string} 'pending'|'resolved'|'rejected'
	 *
	 */
	state() {
		return null
	}

	/**
	 * Adds handlers to be called when the Deferred object is resolved.
	 * This method accepts one or more arguments, all of which can be either a single function or an array of functions. When the Deferred is resolved, the doneCallbacks are called. Callbacks are executed in the order they were added.
	 * @param {(Function|Function[])} doneCallbacks
	 * @return {Deferred}
	 */
	done(doneCallbacks) {
		return null
	}



	/**
	 * Adds handlers to be called when the Deferred object generates progress notifications. 
	 * This method accepts one or more arguments, all of which can be either a single function or an array of functions. When Deferred.notify() is called, the function or functions are called.
	 * @param {(Function|Function[])} progressCallbacks 
	 * @return {Deferred}
	 */
	progress() {
		return null
	}


	/**
	 * Adds handlers to be called when the Deferred object is either resolved or rejected.
	 * The deferred.always() method receives the arguments that were used to .resolve() or .reject() the Deferred object, which are often very different.
	 * @param {(Function|Function[])} alwaysCallbacks A function, or array of functions, that is called when the Deferred is resolved or rejected.
	 * @return {Deferred}
	 */
	always(alwaysCallbacks) {
		return null
	}


	/**
	 * Adds handlers to be called when the Deferred object is resolved, rejected, or in progress.
	 * @param {Function} doneFilter A function that is called when the Deferred is resolved.
	 * @param {Function} [failFilter]  An optional function that is called when the Deferred is rejected.
	 * @param {Function} [progressFilter] An optional function that is called when progress notifications are sent.
	 * @return {Deferred}
	 */
	then(doneFilter, failFilter, progressFilter) {
		return null
	}


	/**
	 * Resolve a Deferred object and call any doneCallbacks with the given args.
	 * @param {object} args
	 * @return {Deferred}
	 */
	resolve() {}
}