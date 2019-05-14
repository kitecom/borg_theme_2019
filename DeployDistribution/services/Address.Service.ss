function service(request, response)
{
	'use strict';
	try 
	{
		require('Address.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Address.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}