function service(request, response)
{
	'use strict';
	try 
	{
		require('Account.Login.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Account.Login.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}