function service(request, response)
{
	'use strict';
	try 
	{
		require('ProductList.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ProductList.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}