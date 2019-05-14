/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('SC.Extensions'
,	[
		'jQuery'
	,	'underscore'
	]
,	function(
        jQuery
	,	_
	)
{
	'use strict';
	
    if (SC && SC.extensionModules)
    {
        return jQuery.when.apply(jQuery, _.map(SC.extensionModules, function(appModuleName)
        {
            var promise = jQuery.Deferred();
            try
			{
            	require(
            		[appModuleName]
				,	promise.resolve
				,	function(error)
					{
						console.error(error);
						promise.resolve();
					}
				);
			}
			catch(error)
			{
				console.error(error);
                promise.resolve();
			}
            return promise;
        }));
    }
    return jQuery.Deferred().resolve();
});