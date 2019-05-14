function service(request, response)
{
	'use strict';
	try 
	{
		require('Invoice.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Invoice.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}