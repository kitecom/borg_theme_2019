// @module Borg.BorgAccountMenu.BorgAccountMenu
define('Borg.BorgAccountMenu.BorgAccountMenu.View'
,	[
		'borg_borgaccountmenu_borgaccountmenu.tpl'
	,	'Utils'
	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function (
		borg_borgaccountmenu_borgaccountmenu_tpl
	,	Utils
	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	// @class Borg.BorgAccountMenu.BorgAccountMenu.View @extends Backbone.View
	return Backbone.View.extend({

		template: borg_borgaccountmenu_borgaccountmenu_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service 
				(you'll need to deploy and activate the extension first)
			*/
			this.message = '';
			// var service_url = Utils.getAbsoluteUrl(getExtensionAssetsPath('services/BorgAccountMenu.Service.ss'));

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

		//@method getContext @return Borg.BorgAccountMenu.BorgAccountMenu.View.Context
	,	getContext: function getContext()
		{
			//@class Borg.BorgAccountMenu.BorgAccountMenu.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});