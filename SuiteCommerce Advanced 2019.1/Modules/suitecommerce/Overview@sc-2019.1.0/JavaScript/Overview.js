/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Overview
// Defines the Overview module (Router)
define('Overview'
,	[
		'Overview.Home.View'
	,	'underscore'
	,	'Utils'
	]
,	function(
		OverviewHomeView
	,	_
	,	Utils
	)
{
	'use strict';

	// @class Overview @extends ApplicationModule
	var OverviewModule =
	{
		MenuItems:
			[
				function (application)
				{
					if (!_.isPhoneDevice() && application.getConfig('siteSettings.sitetype') === 'STANDARD' || application.getConfig('siteSettings.sitetype') !== 'STANDARD')
					{
						return 	{
							id: 'home'
						,	name: _('Overview').translate()
						,	url: 'overview'
						,	index: 0
						};
					}
				}
			]

	,	mountToApp: function (application)
		{
			var pageType = application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'MyAccountOverview'
			,	'routes': ['', '?*params', 'overview', 'overview?*params']
			,	'view': OverviewHomeView
			,	'defaultTemplate': {
					'name': 'overview_home.tpl'
				,	'displayName': 'My Account Overview Default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-myaccount-overview.png')
				}
			});
		}
	};

	return OverviewModule;
});
