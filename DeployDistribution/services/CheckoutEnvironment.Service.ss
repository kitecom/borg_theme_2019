function service(request, response)
{
	'use strict';
	try 
	{
		require('CheckoutEnvironment.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CheckoutEnvironment.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}