/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @ts-check

/**
 * Manages backend components. Extensions can get component implementations and register new component classes. A component is always referenced by its name. 
 * @class
 * @hideconstructor
 * @global
 */
class BackendComponentContainer {
	constructor() {}

	/**
	 * Lets you register a new component and seal it in the currently running application.
	 * @param {BackendBaseComponent} component The component to be registered.
	 * @return {void}
	 */
	registerComponent(component) {}

	/**
	 * Returns a component based on a component name, provided there is no component with the same name already in the container.
	 * @param {String} component_name The name of the component.
	 * @return {BackendBaseComponent}
	 */
	getComponent(component_name) {
		return null
	}
}
