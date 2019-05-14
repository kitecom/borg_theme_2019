function service(request, response)
{
	'use strict';
	try 
	{
		require('Case.Fields.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Case.Fields.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}