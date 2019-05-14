function service(request, response)
{
	'use strict';
	try 
	{
		require('ShoppingUserEnvironment.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ShoppingUserEnvironment.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}