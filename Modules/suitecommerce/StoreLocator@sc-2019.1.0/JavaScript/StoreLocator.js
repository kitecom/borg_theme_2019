/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator'
,   [
		'ReferenceMap'
	,	'ReferenceMap.Configuration'
	,   'StoreLocator.Main.View'
	,   'StoreLocator.Details.View'
	,   'StoreLocator.List.All.View'
	,   'StoreLocator.Upgrade.View'
	,   'SC.Configuration'
	,   'Utils'
	,   'underscore'
	]
,   function (
		ReferenceMap
	,	ReferenceConfiguration
	,   StoreLocatorMainView
	,   StoreLocatorDetailsView
	,   StoreLocatorListAllView
	,   StoreLocatorUpgradeView
	,	Configuration
	,   Utils
	,   _
	)
{
	'use strict';

	return {
		//@method mountToApp
		//@param {Object} application
		mountToApp: function mountToApp (application) 
		{
			var configurationIcons = ['storeLocator.icons.stores', 'storeLocator.icons.position', 'storeLocator.icons.autocomplete'];
			
			_.each(configurationIcons, function (property)
			{
				if (Utils.getPathFromObject(Configuration, property, ''))
				{
					Utils.setPathFromObject(Configuration, property, _.getAbsoluteUrlOfNonManagedResources(Utils.getPathFromObject(Configuration, property, '')));
				}
			});
			
			var pageType = application.getComponent('PageType');

			if (ReferenceConfiguration.isEnabled() && window.location.protocol === 'https:')
			{	
				if (Utils.oldIE(8))
				{
					pageType.registerPageType({
						'name': 'StoreLocatorUpgrade'
					,	'routes': ['stores', 'stores/details/:id', 'stores/all', 'stores/all?:options']
					,	'view': StoreLocatorUpgradeView
					,	'defaultTemplate': {
							'name': 'store_locator_upgrade.tpl'
						,	'displayName': 'Browser Upgrade'
						,	'thumbnail': '/path/to/store_locator_upgrade_tpl.png'
						}
					});
				}
				else
				{
					var reference_map = new ReferenceMap();

					pageType.registerPageType({
						'name': 'StoreLocatorMain'
					,	'routes': ['stores']
					,	'view': StoreLocatorMainView
					,	'defaultTemplate': {
							'name': 'store_locator_main.tpl'
						,	'displayName': reference_map.configuration.title()
						,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-store-locator.png')
						}
					});
					
					pageType.registerPageType({
						'name': 'StoreLocatorListAll'
					,	'routes': ['stores/all', 'stores/all?:options']
					,	'view': StoreLocatorListAllView
					,	'defaultTemplate': {
							'name': 'store_locator_list_all.tpl'
						,	'displayName': ReferenceConfiguration.title()
						,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-store-locator-list.png')
						}
					});	

					pageType.registerPageType({
						'name': 'StoreLocatorDetails'
					,	'routes': ['stores/details/:id']
					,	'view': StoreLocatorDetailsView
					,	'defaultTemplate': {
							'name': 'store_locator_details.tpl'
						,	'displayName': reference_map.configuration.title()
						,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-store-locator-details.png')
						}
					});
				}
			}
		}
	};
});