function service(request, response)
{
	'use strict';
	try 
	{
		require('Quote.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Quote.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}