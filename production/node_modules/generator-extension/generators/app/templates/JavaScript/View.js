// @module <%= module_name %>
define('<%= module_name %>.View'
,	[
		'<%= tpl_name %>.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		<%= tpl_dep_name %>_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class <%= module_name %>.View @extends Backbone.View
	return Backbone.View.extend({

		template: <%= tpl_dep_name %>_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service 
				(you'll need to deploy and activate the extension first)
			*/
			this.message = '';
			// var service_url = Utils.getAbsoluteUrl(getExtensionAssetsPath('services/<%=service_name%>.Service.ss'));

			// jQuery.get(service_url)
			// .then((result) => {

			// 	this.message = result;
			// 	this.render();
			// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {
			
		}

		//@method getContext @return <%= module_name %>.View.Context
	,	getContext: function getContext()
		{
			//@class <%= module_name %>.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});