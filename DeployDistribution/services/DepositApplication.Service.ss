function service(request, response)
{
	'use strict';
	try 
	{
		require('DepositApplication.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('DepositApplication.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}