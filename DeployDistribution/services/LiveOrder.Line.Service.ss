function service(request, response)
{
	'use strict';
	try 
	{
		require('LiveOrder.Line.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('LiveOrder.Line.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}