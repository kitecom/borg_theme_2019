/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SiteSearch
define(
    'SiteSearch.Button.View'
,	[
		'SC.Configuration'
	,	'site_search_button.tpl'
    ,	'Backbone'
    ,	'Utils'
    ,	'Backbone.CompositeView'
	]
,	function(
		Configuration
	,	site_search_button
	,	Backbone
    ,	Utils
    ,	BackboneCompositeView
	)
{
	'use strict';

	// @class Site.Search.Button.View @extends Backbone.View
	return Backbone.View.extend({

    	events: {
            'click [data-action="show-itemsearcher"]': 'toggleSiteSearch'
        }

		// @property {Function} template
	,	template: site_search_button

		// @method initialize
		// @param {Site.Search.Button.View.Initialize.Options} options
		// @return {Void}
    ,	initialize: function ()
        {
            this.application = this.options.application;

            Backbone.history.on('all', this.verifyShowSiteSearch, this);

            BackboneCompositeView.add(this);
        }
    
    
        // @method toggleSiteSearch
	,	toggleSiteSearch: function (ev)
        {
            ev && ev.preventDefault();

            // This add a class 'active' to change button color
            this.$('[data-action="show-itemsearcher"]').toggleClass('active');
            var self = this;

            this.application.getLayout().trigger('toggleItemSearcher');
        }

        // @method verifyShowSiteSearch expand the site search only if hash===home and (phone or tablet)
	,	verifyShowSiteSearch: function ()
        {
            var hash = Backbone.history.getFragment() || '';
            hash = hash.indexOf('?') === -1 ? hash : hash.substring(0, hash.indexOf('?'));
            var is_home = hash === '' || hash === '/';

            if (Utils.getDeviceType() !== 'desktop' && is_home)
            {
                this.toggleSiteSearch(null, true);
            }
            else
            {
                // This hide sitesearch when navigate
                this.application.getLayout().trigger('hideItemSearcher');
            }
        }
});
});
