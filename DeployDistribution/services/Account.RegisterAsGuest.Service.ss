function service(request, response)
{
	'use strict';
	try 
	{
		require('Account.RegisterAsGuest.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Account.RegisterAsGuest.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}