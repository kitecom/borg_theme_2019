// @ts-check

/** 
 * CancelableEvents is a class that allows an operation to be canceled before it is completed. 
 * 
 * In the SuiteCommerce Extensibility API, most operations have a before and after event. The operation can be canceled before it is executed by creating a component listener that subscribes to the before event. Business logic in the listener can then throw an error or return a {@link Deferred} object in the rejected state.  
 * 
 * For example, in CartComponent.js, the `AddLine` method is used to add a line to the cart. The `beforeAddLine` event occurs before the line is added and the `afterAddLine` events occurs after the line is added.
 * 
 * @example <caption>Canceling an option selection from a listener by throwing an error:</caption>
 * 
 * pdp_component.on('beforeOptionSelection', function()	{
 * 	if(someCondition)
 * 		throw new Error('Canceling select option.');
 * });
 * 
 * @example <caption>Canceling an option selection from a listener by returning a rejected promise:</caption>
 * 
 * pdp_component.on('beforeOptionSelection', function()	{
 *   if(someCondition)
 *      return jQuery.Deferred().reject(new Error('Canceling select option.'));
 * });
 * 
 * @class 
 * @hideconstructor
 * @global
 */


class BackendCancelableEvents {

	/**
	  Attaches an event handler to an event.
	  @param {String} event_name The event name that the handler will be attached to.
	  @param {Function} handler The event handler (function) that will be invoked when *event_name* is triggered. The event handler can accept one optional callback parameter. The event handler can return a Deferred object, which if resolved, executes the callback function. If the promise is rejected, the callback function does not execute.
	  @return {void}
	  */
	cancelableOn(event_name, handler) {
    return null
  }

	/** 
	  Detaches an event handler from an event.
	  @param {String} event_name The event name that the handler will be detached from. This argument is required.
	  @param {Function} handler The event handler (function) that will be removed from the list of registered handlers. This argument is required.
	  @return {void}
	  */
	cancelableOff(event_name, handler) {
    return null
  }

	/**
	  Disables all event handlers attached to an event.
	  @param {String} event_name The name of the event for which event handlers will be disabled.
	  @return {void}
	  */
	cancelableDisable(event_name) {
    return null
  }

	/** 
	  Re-enables all event handlers attached to an event.
	  @param {String} event_name The name of the event for which event handlers will be re-enabled.
	  @return {Void}
	  */
  cancelableEnable(event_name) {
    return null
  }
  
	/**
	  Triggers an event with one or more arguments. If any of the event handlers associated with the event are rejected, callbacks will not be executed.
	  @param {String} event_name The name of the event to trigger.
	  @param {...params} args Any arguments to be passed to all event handlers attached to the event.
	  @return {Deferred} Returns a Deferred object. Because event handlers are sometimes asynchronous, any callbacks in the event handlers will also be asynchronous.
	  */
	cancelableTrigger(event_name, ...params) {
		return null
	}

	/**
	  Triggers an event with one or more unsanitized arguments. If any of the event handlers associated with the event are rejected, callbacks will not be executed.
	  @param {String} event_name The name of the event to trigger.
	  @param {...params} args Any arguments to be passed to all event handlers attached to the event.
	  @return {Deferred} Returns a Deferred object. Because event handlers are sometimes asynchronous, any callbacks in the event handlers will also be asynchronous.
	  */
	cancelableTriggerUnsafe(event_name) {
		return null
	}
}


