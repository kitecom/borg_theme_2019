function service(request, response)
{
	'use strict';
	try 
	{
		require('GoogleTagManager.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('GoogleTagManager.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}