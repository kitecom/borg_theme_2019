
function service(request, response)
{
	'use strict';
	try 
	{
		require('Borg.BorgAccountMenu.BorgAccountMenu.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('Borg.BorgAccountMenu.BorgAccountMenu.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}