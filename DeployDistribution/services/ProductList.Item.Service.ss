function service(request, response)
{
	'use strict';
	try 
	{
		require('ProductList.Item.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ProductList.Item.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}