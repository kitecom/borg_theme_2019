function service(request, response)
{
	'use strict';
	try 
	{
		require('MyAccountEnvironment.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('MyAccountEnvironment.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}