/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// DateEffectiveCategory.ServiceController.js
// ----------------
// Service to manage categories within SMT
define(
	'DateEffectiveCategory.ServiceController'
,	[
		'ServiceController'
	,	'Categories.Model'
	,	'Configuration'
	]
,	function(
		ServiceController
	,	CategoriesModel
	,	Configuration
	)
	{
		'use strict';


		return ServiceController.extend({

			name: 'DateEffectiveCategory.ServiceController'
			/**
			 * Mandatory params:domain, date
			 * Optional params: fullurl, menuLevel
			 */
		,	get: function()
			{
				this.controlAccess();
				if(!this.request.getParameter('date')){
					throw invalidParameter;
				}
				Configuration.setConfig({domain: this.request.getParameter('domain')});
				var fullurl = this.request.getParameter('fullurl');
				if (fullurl)
				{
					return CategoriesModel.get(fullurl, this.request.getParameter('date'));
				}
				else
				{
					var menuLevel =  this.request.getParameter('menuLevel');
					if (menuLevel)
					{
						return CategoriesModel.getCategoryTree(menuLevel, this.request.getParameter('date'));
					}
				}
			}
		,	controlAccess: function (){
				var origin = this.request.getHeader('Referer') || this.request.getHeader('referer') || this.request.getHeader('Origin') || ''
				,   domain = this.request.getParameter('domain');

				origin = origin.match(/(https?:\/\/)?([^/^:]*)\/?/i);
				origin = origin && origin[2];

				if(!domain || !origin || origin !== domain)
				{
					throw forbiddenError;
				}
			}
		,	options: function () {
				return {
					get: {
						jsonp_enabled: true
					}
				};
			}
		});
	}
);
