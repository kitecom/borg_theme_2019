function service(request, response)
{
	'use strict';
	try 
	{
		require('Deposit.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Deposit.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}