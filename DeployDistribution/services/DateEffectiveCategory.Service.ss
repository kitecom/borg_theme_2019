function service(request, response)
{
	'use strict';
	try 
	{
		require('DateEffectiveCategory.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('DateEffectiveCategory.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}