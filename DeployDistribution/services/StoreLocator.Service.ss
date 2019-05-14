function service(request, response)
{
	'use strict';
	try 
	{
		require('StoreLocator.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('StoreLocator.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}