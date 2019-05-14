function service(request, response)
{
	'use strict';
	try 
	{
		require('CustomerPayment.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CustomerPayment.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}