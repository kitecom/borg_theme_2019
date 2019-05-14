/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ssp.libraries
// Supports infrastructure for defining model classes by using SCModel.
define('SC.EventWrapper',
	[
		'Application'
	,	'Backbone.Validation'
	,	'underscore'
	,	'SuiteLogs'
	]
,	function (
			Application
		,	BackboneValidation
		,	_
		,	SuiteLogs
	)
{
	'use strict';

	return {
		name: 'SCEventWrapper'

		/*
		@method extend use SCEventEmitter.extend to define new models. Example:

		var MyCoolThing = SCEventEmitter.extend({
			name: 'MyCoolThing'
		,	get: function(id)
			{
				return this.serialize(nlapiLoadRecord('MyCoolThingRecordType', id));
			}
		,	serialize: function() {...TODO...}
		});

		@param {name:String} model the properties and methods of the new class. The name is mandatory
		@return {SCModel} the new instance model with the new properties added ready to be used
		*/
	,	extend: function (model)
		{
			if (!model.name && !this.name)
			{
				throw {
					status: 400
				,	code: 'ERR_MISSING_MODEL_NAME'
				,	message: 'Missing model name.'
				};
			}

			var new_model = {};

			_.extend(new_model, this, model);

			_.each(new_model, function extendFunctionWithEvents(value, key)
			{
				if (typeof value === 'function' && key !== 'extend')
				{
					new_model[key] = wrapFunctionWithEvents(key, new_model, value);
				}
			});

			return new_model;
		}
	};

	// @method wrapFunctionWithEvents Gives to the received method the ability to trigger events.
	// @return {Function} result The function wrapped with events.
	function wrapFunctionWithEvents (methodName, model, fn)
	{
		return _.wrap(fn, function wrapFunctionWithEvents(func)
		{
			// Gets the arguments passed to the function from the execution code (removes func from arguments)
			var args = _.toArray(arguments).slice(1)
			,	functionName = model.name + '.' + methodName
			,	result;

			
			// Fires the 'before:ObjectName.MethodName' event most common 'before:Model.method'
			Application.trigger.apply(Application, ['before:' + functionName, this].concat(args));

			if (window.suiteLogs)
			{
				try
				{
					SuiteLogs.start(functionName, args);
					result = func.apply(this, args);
					SuiteLogs.end();
				}
				catch (e)
				{
					SuiteLogs.end(e);
					throw e;
				}
			}	
			else
			{
				result = func.apply(this, args);
			}

			// Fires the 'before:ObjectName.MethodName' event adding result as 1st parameter
			Application.trigger.apply(Application, ['after:' + functionName, this, result].concat(args));

			// Returns the result from the execution of the real code, modifications may happend in the after event
			return result;
		});
	}
});