function service(request, response)
{
	'use strict';
	try 
	{
		require('Account.ForgotPassword.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Account.ForgotPassword.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}