function service(request, response)
{
	'use strict';
	try 
	{
		require('CreditMemo.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('CreditMemo.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}