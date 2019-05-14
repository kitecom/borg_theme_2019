function service(request, response)
{
	'use strict';
	try 
	{
		require('ReorderItems.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ReorderItems.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}