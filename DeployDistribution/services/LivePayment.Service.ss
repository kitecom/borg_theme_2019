function service(request, response)
{
	'use strict';
	try 
	{
		require('LivePayment.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('LivePayment.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}