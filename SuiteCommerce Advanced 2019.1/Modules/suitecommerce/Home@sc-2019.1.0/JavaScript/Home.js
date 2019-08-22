/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Home
define(
	'Home'
,	[
		'Home.View'
	,	'Utils'
	]
,	function (
		HomeView
	,	Utils
	)
{
	'use strict';

	//@class Home @extends ApplicationModule
	return {
		mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'home-page'
			,	'routes': ['', '?*params']
			,	'view': HomeView
			,	'defaultTemplate': {
					'name': 'home.tpl'
				,	'displayName': 'Home Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-home.png')
				}
			});
		}
	};
});
