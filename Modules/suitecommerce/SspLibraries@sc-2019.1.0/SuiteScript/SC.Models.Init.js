/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.Models.Init'
	, [
		'underscore'
	,	'SuiteLogs'
	]
	, function (
		_
	,	SuiteLogs
	)
	{
		'use strict';

		var wrapped_objects = {}
		,	suite_script_functions_to_wrap = [
				'nlapiCreateSearch'
			,	'nlapiLoadRecord'
			,	'nlapiSearchRecord'
			,	'nlapiSubmitRecord'
			,	'nlapiCreateRecord'
			,	'nlapiLookupField'
			,	'nlapiSubmitField'
			,	'nlapiCreateFile'
			,	'nlapiDeleteFile'
			,	'nlapiLoadFile'
			,	'nlapiSubmitFile'
			,	'nlapiTransformRecord'
			,	'nlapiVoidTransaction'
			,	'nlapiLoadSearch'
			,	'nlapiLoadConfiguration'
			,	'nlapiSubmitConfiguration'
			,	'nlapiGetLogin'
			]
		,	container = null
			, session = null
			, customer = null
			, context = null
			, order = null;

		// only initialize vars when the context actually have the functions
		switch (nlapiGetContext().getExecutionContext())
		{
		case 'suitelet':
			context = nlapiGetContext();
			break;
		case 'webstore':
		case 'webservices':
		case 'webapplication':
			container = nlapiGetWebContainer();
			session = container.getShoppingSession();
			customer = session.getCustomer();
			context = nlapiGetContext();
			order = session.getOrder();
			break;
		default:
			break;
		}

		function wrapObject(object, class_name)
		{
			if (!wrapped_objects[class_name])
			{
				wrapped_objects[class_name] = {};

				for (var method_name in object)
				{
					if (method_name !== 'prototype')
					{
						wrapped_objects[class_name][method_name] = wrap(object, method_name, class_name);
					}
				}
			}

			return wrapped_objects[class_name];
		}

		function wrap(object, method_name, class_name, original_function)
		{
			return function ()
			{
				var result
				,	function_name = class_name + '.' + method_name + '()';
			
				SuiteLogs.start(function_name, arguments);

				try
				{
					if (original_function)
					{
						result = original_function.apply(object, arguments);
					}
					else
					{
						result = object[method_name].apply(object, arguments);
					}
					SuiteLogs.end();
				}
				catch (e)
				{
					SuiteLogs.end(e);

					throw e;
				}

				return result;
			};
		}

		if (window.suiteLogs)
		{
			_.each(suite_script_functions_to_wrap, function (method_name)
			{
				this[method_name] = wrap(this, method_name, 'SuiteScript', this[method_name]);
			}, this);

			return {
				container: wrapObject(container, 'WebContainer')
				, session: wrapObject(session, 'ShoppingSession')
				, customer: wrapObject(customer, 'Customer')
				, context: wrapObject(context, 'Context')
				, order: wrapObject(order, 'Order')
			};
		}
		else
		{
			return {
				container: container
				, session: session
				, customer: customer
				, context: context
				, order: order
			};
		}
	});