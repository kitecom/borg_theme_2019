/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.BaseComponent'
,	[
		'SC.CancelableEvents'
	,	'SC.ComponentErrors'
	,	'Utils'

	,	'underscore'
	]
,	function (
		SCCancelableEvents
	,	SCComponentErrors
	,	Utils

	,	_
	)
{
	'use strict';

	// @class SC.BaseComponent Base abstract class for front-end components. Use method @?method SC.SC.BaseComponent.extend to build concrete components.
	// Implements helper methods for Views manipulation
	// @extends SC.CancelableEvents
	var base_component = _.extend({

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

			return new_component;
		}

		// @method _reportError Internal method used to centrally handle error reporting
		// @private
		// @param {String} code Error code
		// @param {String} description Error description
		// @return {Error}
	,	_reportError: function _reportError (code, description)
		{
			var error = new Error(description);
			error.name = code;
			throw error;
		}

		// @method _exposeAPIEvent Handle common code to expose private Application before and after events
		// into public Extensibility events
		// @param {String} event_name name of the private event
		// @return {jQuery.Deferred}
		// @private
	,	_exposeAPIEvent: function _exposeAPIEvent()
		{
			var	args = Array.prototype.slice.call(arguments);

			return this.cancelableTrigger.apply(this, args);
		}

		//@method _suscribeToInnerEvents subscribes to the inner events, according to the innerToOuterMap parameter, in order to trigger the outer events
		//@param {Array<String, String, Function>} innerToOuterMap Maps inner events with outer events
		//@private
	,	_suscribeToInnerEvents: function _suscribeToInnerEvents(innerToOuterMap, model)
		{
			var self = this;

			_.map(innerToOuterMap, function(innerToOuter){

				var exposeInnerEvent = function exposeInnerEvent()
				{
					//remove the model (first argument) and keeps the first place of the array
					var args = Utils.deepCopy(Array.prototype.slice.call(arguments));
					args = innerToOuter.normalize ? innerToOuter.normalize.apply(self, args) : args;
					//prepend the event name to the arguments array
					args = _.isArray(args) ? args : [args];
					args.unshift(innerToOuter.outer);

					_.each(innerToOuter.disableEvents || [], function(event_name)
					{
						self.cancelableDisable(event_name);
					});
					_.each(innerToOuter.enableEvents || [], function(event_name)
					{
						self.cancelableEnable(event_name);
					});

					return self._exposeAPIEvent.apply(self, args);
				};

				model.cancelableOn(innerToOuter.inner, exposeInnerEvent);

				model.on('destroy', function cancelOffInnerEvent()
				{
					model.cancelableOff(innerToOuter.inner, exposeInnerEvent);
				});
			});
		}

	}, SCCancelableEvents);

	// @method on alias for @?method SC.SC.CancelableEvents.cancelableOn @extlayer @public
	base_component.on = base_component.cancelableOn;
	// @method off alias for @?method SC.SC.CancelableEvents.cancelableOff @extlayer @public
	base_component.off = base_component.cancelableOff;

	base_component.ERROR_IDENTIFIERS = SCComponentErrors;

	return base_component;
});
