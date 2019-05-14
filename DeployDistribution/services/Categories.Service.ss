function service(request, response)
{
	'use strict';
	try 
	{
		require('Categories.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Categories.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}