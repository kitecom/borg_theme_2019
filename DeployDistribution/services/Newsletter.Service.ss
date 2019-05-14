function service(request, response)
{
	'use strict';
	try 
	{
		require('Newsletter.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Newsletter.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}