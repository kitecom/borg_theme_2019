/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Environment component. see APIdocs/JavaScript/EnvironmentComponent.js for documentation
define(
	'SC.Environment.Component'
,	[
		'SC.BaseComponent'
    ,   'Utils'
    ,   'SC.Configuration'
    ,   'underscore'
	]
,	
    /**
     * @param {BaseComponent} SCBaseComponent
     * @param {Utils} Utils
     */
    function(
		SCBaseComponent
    ,   Utils
    ,   Configuration
    ,   _
	)
{
    'use strict';
    
    return {

        /**@param {ComponentContainer} container */
        mountToApp: function(container)
        {
            container.registerComponent(this.componentGenerator(container));
        }

    ,   componentGenerator: function(container)
        {

            return SCBaseComponent.extend({
                
                componentName: 'Environment'

            ,	application: container
                
            ,	getConfig: function getConfig(key)
                {
                    return Utils.deepCopy(Utils.getPathFromObject(Configuration, key)); 
                }

            ,   isPageGenerator: function isPageGenerator()
                {
                    return typeof nsglobal !== 'undefined';
                }

            ,   getSiteSetting: function getSiteSettings(key) 
                {
                    return Utils.deepCopy(Utils.getPathFromObject(SC.ENVIRONMENT.siteSettings, key)); 
                }
                
            ,   getSession: function getSession() 
                {
                    var data = Utils.deepCopy(SC.SESSION); 
                    delete data.touchpoints;
                    return data; 
                }
                
            ,   setTranslation: function setTranslation(locale, keys)
                {
                    if(this.getSession().language.locale === locale) 
                    {
                        _.each(keys, function(entry)
                        {
                            SC.Translations[entry.key] = entry.value;
                        });
                    }
                }
            });
        }

    };
});