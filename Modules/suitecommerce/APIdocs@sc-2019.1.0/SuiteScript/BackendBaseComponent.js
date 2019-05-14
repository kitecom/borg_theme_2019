/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @ts-check

/** 
 * Base abstract class for SuiteScript-based back-end components. Use method [BackendBaseComponent.extend]{@link BackendBaseComponent#extend} to build a specific component implementation. 
 * For each method defined in a component, an equivalent synchronous method is created automatically. For example, if an implementation has a method foo() that returns a {@link Deferred}, and the component extends {@link BackendBaseComponent}, an extra method fooSync() is created automatically. The fooSync() method will return the value of the resolved Deferred object, instead of the Deferred object itself. 
 * @class
 * @extends BackendCancelableEvents
 * @hideconstructor
 * @global
 */
class BackendBaseComponent extends BackendCancelableEvents {

	constructor() {
		super()

		/**
		 * A name that identifies the component. Use the name to register a new component and get a component implementation with {@link BackendComponentContainer}. 
		 * @type {string} 
		 */
		this.componentName = ''
	}

	/**
	 * Extends the current component and returns a child component.
	 * @param {{}} componentDefinition Any object that has properties and methods.
	 * @return {BackendBaseComponent}
	 * @static
	 */
	extend(componentDefinition) {
		return null
	}

	/** 
	 * Attaches an event handler to an event name. Alias for {@link BackendCancelableEvents#cancelableOn}. 
     * @param {string} event_name The event name that the handler will be attached to.
     * @param {Function} handler The event handler (function) that will be invoked when *event_name* is triggered. The event handler can accept one optional callback parameter. The event handler can return a Deferred object, which if resolved, executes the callback function. If the promise is rejected, the callback function does not execute.
	 * @return {void}
	 */
	on(event_name, handler) {}

	/**
	 * Detaches an event handler from an event name. Alias for {@link BackendCancelableEvents#cancelableOff}.    	
     * @param {string} event_name The event name that the handler will be detached from. Optional.
     * @param {Function} handler The event handler (function) that will be removed from the list of registered handlers. 
     * @return {void}
	 */
	off(event_name, handler) {}
}	

