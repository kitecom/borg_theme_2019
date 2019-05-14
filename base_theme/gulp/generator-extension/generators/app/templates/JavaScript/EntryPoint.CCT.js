// @module <%= module_name %>

// An example cct that shows a message with the price, using the context data from the item

// Use: Utils.getAbsoluteUrl(getExtensionAssetsPath('services/service.ss')) 
// to reference services or images available in your extension assets folder

define(
	'<%= module_name %>'
,   [
		'<%= module_name %>.View'
	]
,   function (
		<%= module_dep_name%>View
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			container.getComponent('CMS').registerCustomContentType({
				
				// this property value MUST be lowercase
				id: '<%= cct_id %>'
				
				// The view to render the CCT
			,	view: <%= module_dep_name%>View
			});
		}
	};
});