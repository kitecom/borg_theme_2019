function service(request, response)
{
	'use strict';
	try 
	{
		require('TransactionHistory.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('TransactionHistory.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}