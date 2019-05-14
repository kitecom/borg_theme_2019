function service(request, response)
{
	'use strict';
	try 
	{
		require('ProductReviews.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('ProductReviews.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}