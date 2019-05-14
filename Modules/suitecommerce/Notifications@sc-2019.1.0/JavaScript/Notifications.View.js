/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Notifications
define(
	'Notifications.View'
,	[	
		'Notifications.Order.View'
	,	'Notifications.Profile.View'
	
	,	'notifications.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	]
,	function(
		NotificationsOrderView
	,	NotificationsProfileView

	,	notifications_tpl

	,	Backbone
	,	BackboneCompositeView
	)
{
	'use strict';

	// @class Notifications.View @extends Backbone.View
	return Backbone.View.extend({

		template: notifications_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

		// @property {ChildViews} childViews
	,	childViews: {
			'Order.Notifications': function ()
			{
				return new NotificationsOrderView();
			}
		,	'Profile.Notifications': function ()
			{
				return new NotificationsProfileView();
			}
		}

		// @method getContext @return Notifications.View.Context
	,	getContext: function ()
		{
			//@class Notifications.View.Context
			return {};
		}
	});
});