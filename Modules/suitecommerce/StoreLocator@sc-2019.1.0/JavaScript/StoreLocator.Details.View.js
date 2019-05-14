/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Details.View'
,	[
		'StoreLocator.Map.View'
	,	'Location.VenueDetails.View'
	,   'StoreLocator.Model'
	,	'ReferenceMap'
	,	'Backbone.CompositeView'
	,	'Profile.Model'
	,	'AjaxRequestsKiller'
	,	'store_locator_details.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (

		StoreLocatorMapView
	,	LocationVenueDetailsView
	,	StoreLocatorModel
	,	ReferenceMap
	,	BackboneCompositeView
	,	ProfileModel
	,	AjaxRequestsKiller
	,	store_locator_details_tpl
	
	,	Backbone
	,	_
	)
{
	'use strict';

	return Backbone.View.extend({

		template: store_locator_details_tpl

		//@property {Object} attributes
    ,   attributes: {
            'id': 'StoreLocatorDetails'
        ,   'class': 'StoreLocatorDetails'
        }

		//@method initialize
		//@params {Object} options
	,	initialize: function initialize (options)
		{
			this.reference_map = new ReferenceMap()
			this.model = new StoreLocatorModel()
			this.reference_map.model = this.model;
			this.routerArguments = options.routerArguments;
			this.application = options.application;
			this.profile_model = ProfileModel.getInstance();

			//@property {String} title
			this.title = this.reference_map.configuration.title();
			BackboneCompositeView.add(this);
		}

	,	beforeShowContent: function beforeShowContent()
		{
			var id = this.routerArguments[0];

			return this.model.fetch({
				data: {
					internalid: id
				}
			,	killerId: AjaxRequestsKiller.getKillerId()
			});
		}

		//@property {Object} childViews
	,	childViews: {
			
			'LocatorMap': function ()
			{
				return new StoreLocatorMapView({
					application: this.application
				,	reference_map: this.reference_map
				,	model: this.model
				});
			}

		,	'StoreLocationInfo': function ()
			{
				return new LocationVenueDetailsView({
					application: this.application
				,	model: this.model
				,	showAddress: true
				});
			}
		}

		//@method getContext @returns StoreLocator.Details.View.Context
	,	getContext: function getContext ()
		{
			var last_navigation = this.profile_model.get('storeLocator_last_search')
			,	direction_url = this.reference_map.getDirectionsUrl(last_navigation, this.model.get('location'));

			return {
			
					title: this.reference_map.configuration.title
				
				,	directionUrl: direction_url
				
				,	redirectUrl: !!last_navigation ? 'stores' : 'stores/all'
			};
		}

	});
});
