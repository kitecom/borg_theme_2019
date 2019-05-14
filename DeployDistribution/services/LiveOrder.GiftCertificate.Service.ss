function service(request, response)
{
	'use strict';
	try 
	{
		require('LiveOrder.GiftCertificate.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('LiveOrder.GiftCertificate.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}