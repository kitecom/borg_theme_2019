function service(request, response)
{
	'use strict';
	try 
	{
		require('Account.Register.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Account.Register.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}