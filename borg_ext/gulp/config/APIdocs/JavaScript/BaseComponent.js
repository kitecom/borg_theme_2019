/**
 * Base abstract class for front-end components.
 * @class
 * @extends CancelableEvents
 * @hideconstructor
 * @global
 */
class BaseComponent extends CancelableEvents {

	constructor() {
		super()

		/**
		 * A unique name that identifies the component. Use the component name when getting a component, for example, `application.getComponent(componentName)`.
		 * @type {String}
		 */
		this.componentName = ''

		/**
		 * The name which identify this kind of component. This name is used both for registering a new component and
		 * getting a component implementation with {@link ComponentContainer}
		 * @type {ComponentContainer}
		 */
		this.application = new ComponentContainer()
	}

	/**
	 * Extends the current component and creates a child component.
	 * @param {{}} componentDefinition An object with the appropriate properties and methods to create the component.
	 * @return {BaseComponent}
	 */
	extend(componentDefinition) {
		return new BaseComponent()
	}

	/**
	 * Attaches an event handler to an event name. Alias for {@link CancelableEvents#cancelableOn}.
     * @param {String} event_name The name of the event to attach to
     * @param {Function} handler
	 * @return {void}
	 */
	on(event_name, handler) {
		return null
	}

	/**
	 * Detaches an event handler from an event name. Alias for {@link CancelableEvents#cancelableOff}.
     * @param {String} event_name The name of the event from which to detach the event handler.
     * @param {Function} handler 
     * @return {void}
	 */
	off(event_name, handler) {
		return null
	}
}