function service(request, response)
{
	'use strict';
	try 
	{
		require('Transaction.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Transaction.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}