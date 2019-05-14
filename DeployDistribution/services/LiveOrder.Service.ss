function service(request, response)
{
	'use strict';
	try 
	{
		require('LiveOrder.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('LiveOrder.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}