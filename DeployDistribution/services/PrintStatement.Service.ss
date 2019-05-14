function service(request, response)
{
	'use strict';
	try 
	{
		require('PrintStatement.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('PrintStatement.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}