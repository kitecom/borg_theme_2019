function service(request, response)
{
	'use strict';
	try 
	{
		require('QuoteToSalesOrder.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('QuoteToSalesOrder.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}