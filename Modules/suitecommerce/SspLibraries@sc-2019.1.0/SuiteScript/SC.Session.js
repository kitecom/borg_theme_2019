/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//! © 2018 NetSuite Inc.
/**
 *  @module PosApplication
 *  @class  SCIS.Session
 **/
define('SC.Session'
	, [
		'SC.Model'
		, 'Configuration'
		, 'underscore'
	]
	, function (
		SCModel
		, Configuration
		, _
	)
	{
		'use strict';
		var context = nlapiGetContext()
		,	isSCIS = undefined
		,	location
		,	subsidiary;

		return SCModel.extend(
		{
			name: 'SC.Session'
			/*
			 *	Returns the location id for the employee.
			 *		if SCIS => the selecetd scis location
			 *		else => the employee location field.
			 */
		,	getCurrentLocation: function getCurrentLocation()
			{
				isSCIS = _.isUndefined(isSCIS) ? Configuration.get().isSCIS : isSCIS;

				if (isSCIS)
				{
					location = location || JSON.parse(context.getSessionObject('location'));
					location = location && _.isObject(location) ? location.internalid : location;
				}
				else
				{
					location = location || context.getLocation();
				}
				return location + '';
			}

			/*
			 *	Returns the current subsidiary for this session.
			 */
			, getCurrentSubsidiary: function getCurrentSubsidiary()
			{
				subsidiary = subsidiary || context.getSubsidiary();
				return subsidiary;
			}

		})
	})