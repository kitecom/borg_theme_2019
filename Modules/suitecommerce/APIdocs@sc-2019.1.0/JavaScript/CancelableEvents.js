/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/** 
 * CancelableEvents is a class that allows an operation to be canceled before it is completed. 
 * 
 * In the SuiteCommerce Extensibility API, most operations have a before and after event. The operation can be canceled before it is executed by creating a component listener that subscribes to the before event. Business logic in the listener can then throw an error or return a {@link Deferred} object in the rejected state. 
 * 
 * For example, in CartComponent.js, the AddLine method is used to add a line to the cart. The beforeAddLine event occurs before the line is added and the afterAddLine events occurs after the line is added. 
 * 
 * @class
 * @hideconstructor
 * @global
 */

class CancelableEvents {
	
	/**
	 * Attaches an event handler to an event.
	 * @param {String} event_name The name of the event to which the event handler will be attached.
	 * @param {Function} handler The event handler method that will be invoked when event_name is triggered. This function can receive optionally one parameter representing the action parameter. Besides optionally can return a Deferred to details the execution of the trigger's callback. If the returned Deferred is rejected the trigger's callback wont be called
	 * @return {void}
	 */
	cancelableOn(event_name, handler) {
		return null
	}
	
	/** 
		Detaches an event handler from an event.
		@param {String} event_name The name of the event from which to detach the event handler. This argument is required.
		@param {Function} handler The event handler that will be removed from the list of handlers attached to the event. This argument is required.
		@return {void}
		*/
	cancelableOff(event_name, handler) {
		return null
	}
	
		/**
			Disables all the event handlers attached to an event.
			@param {String} event_name The name of the event.
			@return {void}
			*/
		cancelableDisable(event_name) {
			return null
		}
	
		/** 
			Re-enables all the event handlers attached to an event.
			@param {String} event_name The name of the event.
			@return {Void}
			*/
		cancelableEnable(event_name) {
			return null
		}
	
		/**
			Triggers an event with a set of arguments. If an event handler is rejected, the event handler callbacks will not be executed.
			@param {String} event_name The name of the event to trigger.
			@param {...params} args One or more arguments that will be broadcast to all event handlers attached to the event.
			@return {Deferred} Returns a Deferred object. Because event handlers are sometimes asynchronous, any callbacks in the event handlers will also be asynchronous.
			*/
		cancelableTrigger(event_name, ...params) {
			return null
		}
	
		/**
			Triggers an event with a set of unsanitized arguments. If an event handler is rejected, the event handler callbacks will not be executed.
			@param {String} event_name The name of the event to trigger.
			@param {...params} args One or more arguments that will be broadcast to all event handlers attached to the event.
			@return {Deferred} Returns a Deferred object. Because event handlers are sometimes asynchronous, any callbacks in the event handlers will also be asynchronous.
			*/
		cancelableTriggerUnsafe(event_name) {
			return null
		}
	}
	