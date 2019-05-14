/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Categories.Utils.js
// -------------
// Utility Class for Categories
define('Categories.Utils'
,	[
		'SC.Configuration'
	,	'underscore'
	]
,	function (
		Configuration
	,	_
	)
{
	'use strict';

	return {

		getAdditionalFields: function getAdditionalFields (source, config_path)
		{
			var additionalFields = {}
			,	fields = Configuration.get(config_path, []);

			_.each(fields, function(field)
			{
				additionalFields[field] = source[field];
			});

			return additionalFields;
		}
	};
});
