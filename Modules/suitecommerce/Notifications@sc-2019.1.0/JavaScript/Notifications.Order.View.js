/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Notifications
define(
	'Notifications.Order.View'
,	[	
		'Notifications.Order.Promocodes.View'
	,	'LiveOrder.Model'
	
	,	'notifications_order.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'

	,	'jQuery'
	,	'underscore'
	]
,	function(
		NotificationsOrderPromocodesView
	,	LiveOrderModel

	,	notifications_order_tpl

	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView

	,	jQuery
	,	_
	)
{
	'use strict';

	// @class Notifications.Order.View @extends Backbone.View
	return Backbone.View.extend({

		template: notifications_order_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
			
			this.model = LiveOrderModel.getInstance();

			this.model.on('change', this.render, this);
			this.model.get('lines').on('add remove', this.render, this);

			this.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);

			this.notification_shown = false;
			
			this.on('afterCompositeViewRender', function(){
				if(this.notification_shown)
				{
					jQuery('body').animate({
						scrollTop: this.$el.offset().top
					}, 600);

					this.notification_shown = false;
				}
			});
			
		}

	,	removePromocodeNotification: function(promocode_id)
		{
			var promocode = _.findWhere(this.model.get('promocodes'), {internalid: promocode_id});

			delete promocode.notification;
		}
		// @property {ChildViews} childViews
	,	childViews: {
			'Promocode.Notifications': function ()
			{
				var promotions = _.filter(this.model.get('promocodes') || [], function (promocode) { return promocode.notification === true; });
				
				if(promotions.length){
					this.notification_shown = true;

					return new BackboneCollectionView({
						collection: promotions
					,	viewsPerRow: 1
					,	childView: NotificationsOrderPromocodesView
					,	childViewOptions: {
							parentModel: this.model
						}
					});
				}
			}
		}

		// @method getContext @return Notifications.Order.View.Context
	,	getContext: function ()
		{
			//@class Notifications.Order.View.Context
			return {};
		}
	});
});