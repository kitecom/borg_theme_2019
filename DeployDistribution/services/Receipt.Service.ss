function service(request, response)
{
	'use strict';
	try 
	{
		require('Receipt.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Receipt.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}