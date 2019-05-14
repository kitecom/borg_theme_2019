/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/**
 * Base abstract class used to manage views and other visual aspects in the application. Other components used to change visual aspects of the application, such as {@link ProductDetailsComponent} and {@link ProductListPageComponent}, inherit from this component. 
 *
 * Use this component to work with child views, DOM event handlers, and child view context data.
 * 
 * @class
 * @extends BaseComponent
 * @hideconstructor
 * @global
 */
class VisualComponent extends BaseComponent {
	
	constructor() {
		super()
	}

	/**
	 * Changes the position of a child view inside a container.
	 * @param {string} view_id The identifier of the view of the current component that contains the child view whose position will be changed.
	 * @param {string} placeholder_selector The identifier of a location in the specified view (view_id) where the child view will be added.
	 * @param {string} view_name The identifier of a view in the placeholder. 
	 * @param {number} index The index of the child view's position. 
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception. 
	 * @throws {Error}
	 */
	setChildViewIndex() {
		return null
	}
	
	
	/**
	 * Adds one or more child views to an existing view. The existing view must already be in the DOM and must have the 'data-view' HTML attribute.
	 *
	 * The addChildViews method is flexible, but more complex than addChildView. Use the simpler {@link addChildView} where possible. 
	 * 
	 * EXAMPLE
	 * ```javascript
	 * checkout.addChildViews(
	 *     checkout.WIZARD_VIEW
	 *     , {
	 *         'Wizard.StepNavigation':
	 *         {
	 *             'CheckoutView':
	 *             {
	 *                 childViewIndex: 1
	 *             ,   childViewConstructor: function ()
	 *                 {
	 *                     return new CheckoutExtensionView({checkout:checkout});
	 *                 }
	 *             }
	 *         }
	 *     }
	 * );
	 * ```
	 * @param {string} view_id The identifier of the view of the current component to which the child views will be added.
	 * @param {object} child_views 
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	addChildViews(view_id, child_views) {
		return null
	}

	/**
	 * Adds a child view to an existing View which is already appended in the DOM with the given `data-view` HTML attribute. 
	 * 
	 * EXAMPLE
	 * ```javascript
	 * checkout.addChildView('Wizard.StepNavigation', function () {
	 *     return new CheckoutExtensionView({checkout:checkout});
	 * });
	 * ```
	 * @param {string} view_id The identifier of the view of the current component to which the child view will be added.
	 * @param {SimpleChildViewConstructor} childViewConstuctor The identifier of the location in the specified view (view_id) where the child view will be added.
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error} 
	 */
	addChildView(view_id, childViewConstuctor) {
		return null
	}

	/**
	 * Removes a child view from a view.
	 * @param {string} view_id The identifier of the view of the current component from which the child view will be removed.
	 * @param {string} placeholder_selector The identifier of the location in the specified view (view_id) from which the child view will be removed.
	 * @param {string} [view_name] The identifier of the view to be removed.
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	removeChildView(view_id, placeholder_selector, view_name) {
		return null
	}

	/**
	 * Adds a property to the UI context of a view to extend interaction with its template.
	 * @param {string} view_id The identifier of the view of the current component to which the context property will be added.
	 * @param {string} property_name The name of the property.
	 * @param {string} type The type of the property. The value returned by the callback function must be of the same type.
	 * @param {Function} callback A function that sets the value of the property (property_name).
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	addToViewContextDefinition(view_id, property_name, type, callback) {
		return null
	}

	/**
	 * Removes a property from the UI context of a view.
	 * @param {string} view_id The identifier of the view of the current component from which the context property will be removed.
	 * @param {string} property_name The name of the property.
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	removeToViewContextDefinition(view_id, property_name) {
		return null
	}

	/**
	 * Adds an event handler to an event in a view.
	 * @param {string} view_id The identifier of the view of the current component to which the event handler will be added.
	 * @param {string} event_selector
	 * @param {Function} callback The event handler function to call when the specified event occurs.
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	addToViewEventsDefinition(view_id, event_selector, callback) {
		return null
	}

	/**
	 * Removes an event handler from an event in a view.
	 * @param {string} view_id The identifier of the view of the current component to which the event handler will be added.
	 * @param {string} event_selector
	 * @return {void} Returns null if the operation is successful. Otherwise, it throws an exception.
	 * @throws {Error}
	 */
	removeToViewEventsDefinition(view_id, event_selector) {
		return null
	}
}

/**
 * @typedef {Function} SimpleChildViewConstructor
 * @param {...any} any
 * @return {View}
 */