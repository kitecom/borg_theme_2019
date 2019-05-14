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

	,	'Application'
	//,	'Instrumentation'

	,	'Utils'
	,	'jQuery.Deferred'
	,	'underscore'
	]
,	function (
		SCCancelableEvents

	,	Application
	//,	Instrumentation

	,	Utils
	,	jQuery
	,	_
	)
{
	'use strict';

	// @param methods_to_async keeps the async api component methods that we need to generate
	// the synchronous version
	var methods_to_async;

	// @function _asyncToSync helper method to generate a synchronous version of a backend async
	// component method. It exist only until we have real asynchronous behavior in backend.
	// @param {Function} async_fn function that returns a @?class jQuery.Deferred
	// @return {Function<Obj>, Function<Error>} Function that returns an Object or throws an error.
	// @private
	var _asyncToSync = function _asyncToSync(async_fn)
	{

		return function synchronousWrapper()
		{
			var result_sync
			,	result_error
			,	args = Array.prototype.slice.call(arguments);

			async_fn.apply(this, args)
			.done(function asyncSuccess(result)
			{
				result_sync = result;
			})
			.fail(function asyncFail(error)
			{
				result_error = error;
			});

			if( result_error )
			{
				throw result_error;
			}

			return result_sync;
		};
	};

	// @class SC.BaseComponent Abstract Base class for SuiteCommerce back-end Components (SuiteScript)
	// Concrete components inherit from this class.
	// @extends SC.CancelableEvents @extlayer
	var base_component = _.extend({


		// @property {String} componentName This is the name that reference this type of component


		// @method extend Extend the current component to generate a child one
		// @param {Object} child_component Any object with properties/methods that will be used to generate the SC.Component that will be returned
		// @return {SC.BaseComponent}
		// @static @public @extlayer
		extend: function extend (child_component)
		{
			if (!child_component || (!child_component.componentName && !this.componentName))
			{
				return this._reportError('INVALID_PARAM', 'Invalid SC.Component. Property "componentName" is required.');
			}

			methods_to_async = _.filter(_.keys(child_component), function(key)
			{
				return _.isFunction(child_component[key]) && key.indexOf('_') !== 0;
			});

			return _.extend({}, this, child_component);
		}

		// @method _reportError Internal method used to centrally handle error reporting
		// @private
		// @param {String} code Error code
		// @param {String} description Error description
		// @return {Void}
	,	_reportError: function _reportError (code, description)
		{
			var error = new Error(description);
			error.name = code;
			throw error;
		}

		// @method _asyncErrorHandle Handle common async error wrappers it throws error so as to cancel the before:model.method events also
		// @param {jQuery.Deferred} deferred
		// @return {Function<Error>, Error} Error handle function
	,	_asyncErrorHandle: function _asyncErrorHandle (deferred)
		{
			return function (error)
			{
				if (error)
				{
					deferred.reject();
					throw error;
				}
			};
		}

		// @method _exposeAPIEvent Handle common code to expose private Application before and after events
		// into public Extensibility events
		// @param {String} event_name name of the event of the form before:<model.name>.metodName
		// @return {jQuery.Deferred}
		// @private
	,	_exposeAPIEvent: function _exposeAPIEvent()
		{
			var	result = jQuery.Deferred()
			,	args = Array.prototype.slice.call(arguments);

			this.cancelableTrigger.apply(this, args)
				.fail(this._asyncErrorHandle(result))
				.done(result.resolve);

			return result;
		}

		// @method _generateSyncMethods helper method to generate a synchronous version of all of the backend async
		// component method. It exist only until we have real asynchronous behavior in backend.
		// @return {Function<Void>} Function that returns an Object or throws an error.
		// @private
	,	_generateSyncMethods: function _generateSyncMethods()
		{
			var self = this;

			_.each(methods_to_async, function(method_name)
		    {
                self[method_name] = _.wrap(self[method_name], function(fn)
                {
					/*Instrumentation.log({
						method_name: method_name
					});*/

                    var args = Array.prototype.slice.call(arguments, 1);
                    return fn.apply(this, args);
                });

		    	self[method_name + 'Sync'] = _asyncToSync(self[method_name]);
		    });
		}

		// @method _suscribeToInnerEvents subscribes to the inner events, according to the innerToOuterMap param, in onrther to trigger the outer events
		// @param {Array<String, String, Function>} innerToOuterMap Maps inner events with outer events
		// @private
	,	_suscribeToInnerEvents: function _suscribeToInnerEvents(innerToOuterMap)
		{
			var self = this;
			_.map(innerToOuterMap, function(innerToOuter){

				Application.on(innerToOuter.inner, function(){
					//remove the model (first argument) and keeps the first place of the array
					var args = Utils.deepCopy(Array.prototype.slice.call(arguments, 1));
					args = innerToOuter.normalize ? innerToOuter.normalize.call(self, args) : args;

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
				});

			});
		}

	}, SCCancelableEvents);

	// @method on alias for @?method cancelableOn @extlayer @public
	base_component.on = base_component.cancelableOn;
	// @method off alias for @?method cancelableOff @extlayer @public
	base_component.off = base_component.cancelableOff;

	return base_component;
});
