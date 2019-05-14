
define(
	'<%= module_name %>', []
,   function ()
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			alert('Hello World I\'m an Extension!!');
		}
	};
});
