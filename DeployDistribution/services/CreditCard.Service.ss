function service(request, response)
{
	'use strict';
	try 
	{
		require('CreditCard.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CreditCard.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}