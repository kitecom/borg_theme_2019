/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.VisualComponent'
,	[
		'Backbone.View.render'
	,	'SC.BaseComponent'
	,	'SC.BaseComponent.ChildViewsComponent'
	,	'SC.BaseComponent.Plugin.RecollectDataViewSelectors'
	,	'Utils'

	,	'underscore'
	,	'Backbone'
	]
,	function (
		BackboneView
	,	SCBaseComponent
	,	SCBaseComponentChildViewsComponent
	,	SCBaseComponentPluginRecollectDataViewSelectors
	,	Utils

	,	_
	,	Backbone
	)
{
	'use strict';

	Backbone.View.postCompile.install(SCBaseComponentPluginRecollectDataViewSelectors());

	// @class SC.BaseComponent Base abstract class for front-end components. Use method @?method SC.SC.BaseComponent.extend to build concrete components.
	// Implements helper methods for Views manipulation
	// @extends SC.CancelableEvents
	var visual_component = _.extend({}, SCBaseComponent, {

		// @property {String} componentName The name which identify this kind of component. This name is used both for registering a new component and
		// getting a component implementation with @?class SC.ComponentContainer
		// @extlayer

		// @property {ApplicationSkeleton} application

		// @method extend Extends the current component to generate a child one
		// @public @extlayer
		// @param {Object} child_component Any object with properties/methods that will be used to generate the SC.Component that will be returned
		// @return {SC.BaseComponent}
		extend: function extend (child_component)
		{
			if (!child_component || (!child_component.componentName && !this.componentName) || !child_component.application)
			{
				return this._reportError('INVALID_PARAM', 'Invalid SC.Component. Property "componentName" and "application" are required.');
			}

			this.application = child_component.application;

			var new_component = _.extend({}, this, child_component);

			new_component.application.getLayout().cancelableOn('beforeAppendView', _.bind(new_component._onApplicationBeforeView, new_component));
			new_component.application.getLayout().on('afterAppendView', _.bind(new_component._onApplicationAfterAppendView, new_component));

			return new_component;
		}

		// @method _onApplicationBeforeView Internal method used to automatically notify when views of the current component are about to be shown (BEFORE append view)
		// @private
		// @param {Backbone.View} view The view that will be shown
		// @return {jQuery.Deferred|Void}
	,	_onApplicationBeforeView: function _onApplicationBeforeView (view)
		{
			if (this._isViewFromComponent(view, true))
			{
				try
				{
					var self = this;
					this.viewToBeRendered = view;
					//@event {Void} showContent Trigger after a PDP is rendered.
					//@public
					return this.cancelableTrigger('beforeShowContent', this._getViewIdentifier(view))
						.always(function(){
							self.viewToBeRendered = null;
						});
				}
				catch(e)
				{
					this.viewToBeRendered = null;
					throw e;
				}
			}
		}

		// @method _onApplicationAfterAppendView Internal method used to automatically notify when views of the current component where shown (AFTER append view)
		// @private
		// @param {Backbone.View} view The view that was shown
		// @return {Void}
	,	_onApplicationAfterAppendView: function _onApplicationAfterAppendView (view)
		{
			if (this._isViewFromComponent(view, true))
			{
				this.viewToBeRendered = null;
				//@event {Void} afterShowContent Trigger after a PDP is rendered.
				//@public
				this.cancelableTrigger('afterShowContent', this._getViewIdentifier(view));
			}
		}

		// @method _getViewIdentifier Given a view that belongs to the current component, returns the "type"/"kind" of view.
		// This is used to determine what view among all the view of the current component is being shown
		// @param {Backbone.View} view
		// @return {String}
		// @private
	,	_getViewIdentifier: function _getViewIdentifier ()
		{
			return 'CURRENT_VIEW';
		}

		// @method _isViewFromComponent Indicate if the passed-in the View is a View of the current component.
		// The aim of this method is to be overwritten
		// @private
		// @param {Backbone.View} view Any view of the system
		// @param {Boolean} is_instance Indicate if the passed in view is an instance or a constructor function.
		// @return {Boolean} True in case the passed in View is a view of the current Component, false otherwise
	,	_isViewFromComponent: function _isViewFromComponent ()
		{
			return false;
		}

		// @method setChildViewIndex Change the position of a Child View inside a container
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will have the Child View to change the index
		// @param {String} placeholder_selector Identifier of the location where the view is located inside the specified View (view_id)
		// @param {String} view_name Identifier of an specific view into the placeholder
		// @param {Number} index The new index to position the Child View
		// @return {null} null if everything works as expected. An exception will be thrown otherwise.
	,	setChildViewIndex: function setChildViewIndex(view_id, placeholder_selector, view_name, index)
		{
			if ((arguments.length === 3) || (arguments.length === 4))
			{
				if (arguments.length === 3)
				{
					index = view_name;
					view_name = placeholder_selector;
					placeholder_selector = view_id;
					view_id = this._getDefaultView();
				}

				if (!_.isNumber(index))
				{
					return this._reportError('INVALID_PARAM', 'The specified index is not valid.');
				}

				this._setChildViewIndex(view_id, placeholder_selector, view_name, index);
			}
			else
			{
				return this._reportError('INVALID_PARAM_COUNT', 'Incorrect number of parameters');
			}
		}

	,	_setChildViewIndex: function _setChildViewIndex(view_id, placeholder_selector, view_name, index)
		{
			var view;

			try
			{
				view = Utils.requireModules(view_id);
			}
			catch (e)
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id is not valid for the current component.');
			}

			if (view && _.isFunction(view.setChildViewIndex) && this._isViewFromComponent(view, false))
			{
				SCBaseComponentChildViewsComponent.setChildViewIndex(view_id, placeholder_selector, view_name, index);
			}
		}

	,	_getDefaultView: function _getDefaultView()
		{
			if (this.DEFAULT_VIEW)
			{
				return this.DEFAULT_VIEW;
			}
			else
			{
				return this._reportError('UNDEFINED_DEFAULTVIEW', 'The "DEFAULT_VIEW" was not defined in the Component');
			}
		}

		// @method addChildView Add a child view in the data-view 'data_view' passed as parameter in the default view of the component
	,	addChildView: function addChildView(data_view, view_constructor)
		{
			var generator = {}
			,	view_id = _.uniqueId('view');

			generator[data_view] = {};
			generator[data_view][view_id] = {
				childViewConstructor: view_constructor
			};

			this.addChildViews(this._getDefaultView(), generator);

			return view_id;
		}
		//@method registerView adds a view to be used in any template within the child views hierarchy
	,	registerView: function registerView(data_view, view_constructor)
		{
			var generator = {};
			generator[data_view] = {};
			generator[data_view][data_view] = {
				childViewConstructor: view_constructor
			};
			this.addChildViews(this._getDefaultView(), generator);
		}
		// Add a new contextData to the view of the component
		// {String} (optional) view_id The id of the view to add the new contextData
		// {String} name The name of the new contextData
		// {Function} func The function that will called when requesting the new contextData
	,	addContextData: function(view_id, name, func)
		{
			if (arguments.length === 2)
			{
				func = name;
				name = view_id;
				view_id = this._getDefaultView();
			}

			if (!_.isString(name))
			{
				this._reportError('INVALID_PARAM', 'The specified name is not valid.');
			}

			if (!_.isFunction(func))
			{
				this._reportError('INVALID_PARAM', 'The specified function is not valid.');
			}

			var view =  Utils.requireModules(view_id);

			if (view)
			{
				view.contextData = view.contextData || {};

				view.contextData[name] = func;
			}
			else
			{
				this._reportError('INVALID_PARAM', 'The specified view_id is not valid for the current component.');
			}
		}

		// @method addChildViews Adds a child view/child views given by the child_views parameter into the specified view of the current component
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra/s child view/s
		// @param {ChildViews} child_views Identifier of the location where the new view will be located inside the specified View (view_id)
		// @return {null} null if everything works as expected. An exception will be thrown otherwise.
	,	addChildViews: function addChildViews (view_id, child_views)
		{
			return this._addChildViews(view_id, child_views);
		}

	,	_addChildViews: function _addChildViews (view_id, child_views)
		{
			var view;

			try
			{
				view = Utils.requireModules(view_id);
			}
			catch (error)
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id is not valid for the current component or the view_constructor is not a function.');
			}

			if (view && _.isFunction(view.addChildViews) && this._isViewFromComponent(view, false))
			{
				view.componentId = view_id;

				SCBaseComponentChildViewsComponent.addChildViews(view_id, child_views);
			}
		}

		// @method removeChildView Removes a child view for a given view id
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra child view
		// @param {String} placeholder_selector Identifier of the location where the new view will be located inside the specified View (view_id)
		// @param {string} view_name Identifier of an specific view into the placeholder
		// @return {null} null if everything works as expected. An exception will be thrown otherwise.
	,	removeChildView: function removeChildView (view_id, placeholder_selector, view_name)
		// If removeChildView is called with only 1 parameter, it will be the placeholder_selector only, and it will remove it from the default_view
		{
			if (arguments.length < 1 || arguments.length > 3)
			{
				return this._reportError('INVALID_PARAM_COUNT', 'Incorrect number of parameters');
			}
			else if (arguments.length === 2)
			{
				view_name = placeholder_selector;
				placeholder_selector = view_id;
				view_id = this._getDefaultView();
			}
			else if (arguments.length === 1)
			{
				view_name = view_id;
				placeholder_selector = view_id;
				view_id = this._getDefaultView();
			}

			this._removeChildView(view_id, placeholder_selector, view_name);
		}

	,	_removeChildView: function removeChildView (view_id, placeholder_selector, view_name)
		{
			var view;

			try
			{
				view = Utils.requireModules(view_id);
			}
			catch (e)
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id is not valid for the current component.');
			}

			if (view && _.isFunction(view.removeChildView) && this._isViewFromComponent(view, false))
			{
				view_name = view_name || placeholder_selector;
				SCBaseComponentChildViewsComponent.removeChildView(view_id, placeholder_selector, view_name);
			}
		}

		// @method addToViewContextDefinition Adds an extra property to the UI context of a view id to extend the interaction with its template
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will have its context extended.
		// @param {String} property_name Name of the new property to be added
		// @param {String} type Name of the type of the result of the callback (function that generates the value of the new property)
		// @param {Function} callback Function in charge of generating the value for the new property.
		// @return {null} null if everything works as expected. An exception will be thrown otherwise.
	,	addToViewContextDefinition: function addToViewContextDefinition (view_id, property_name, type, callback)
		{
			var target_view = Utils.requireModules(view_id);

			if (target_view && _.isFunction(target_view.addExtraContextProperty) && _.isFunction(callback))
			{
				target_view.addExtraContextProperty(property_name, type, callback);
			}
			else
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id ('+view_id+') is not valid for the current component or the callback is not a function.');
			}
		}

		// @method removeToViewContextDefinition Removes an extra property to the UI context of a view.
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will have its context extended.
		// @param {String} property_name Name of the new property to be added
		// @return {null} null if everything works as expected. An exception will be thrown otherwise.
	,	removeToViewContextDefinition: function removeToViewContextDefinition (view_id, property_name)
		{
			var target_view = Utils.requireModules(view_id);

			if (target_view && _.isFunction(target_view.removeExtraContextProperty))
			{
				target_view.removeExtraContextProperty(property_name);
			}
			else
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id ('+view_id+') is not valid for the current component or operation.');
			}
		}

		// @method addToViewEventsDefinition Allows to add an extra event handler over a particular view for the given event selector
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component, that will be extended with an extra event handler.
		// @param {String} event_selector
		// @param {Function} callback Event handler function called when the specified event occurs
		// @return {Void}
	,	addToViewEventsDefinition: function addToViewEventsDefinition (view_id, event_selector, callback)
		{
			var target_view = Utils.requireModules(view_id);

			if (!target_view || !_.isFunction(target_view.addExtraEventHandler) || !_.isFunction(callback))
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id ('+view_id+') is not valid for the current component or operation, or the callback parameter is not a function.');
			}
			else
			{
				target_view.addExtraEventHandler(event_selector, callback);
			}
		}

		// @method removeToViewEventsDefinition Allows to remove and an extra event handler added previously.
		// @public @extlayer
		// @param {String} view_id The identifier of the view, of the current component.
		// @param {String} event_selector
		// @return {Void}
	,	removeToViewEventsDefinition: function removeToViewEventsDefinition (view_id, event_selector)
		{
			var target_view = Utils.requireModules(view_id);

			if (!target_view || !_.isFunction(target_view.addExtraEventHandler))
			{
				return this._reportError('INVALID_PARAM', 'The specified view_id ('+view_id+') is not valid for the current component or operation, or the callback parameter is not a function.');
			}
			else
			{
				target_view.removeExtraEventHandler(event_selector);
			}
		}

	});

	return visual_component;
});
