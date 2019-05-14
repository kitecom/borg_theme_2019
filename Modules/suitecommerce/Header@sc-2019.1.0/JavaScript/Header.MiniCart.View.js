/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.MiniCart.View'
,	[
		'LiveOrder.Model'
	,	'Header.MiniCartSummary.View'
	,	'Header.MiniCartItemCell.View'
	,	'Profile.Model'

	,	'SC.Configuration'
	,	'Tracker'

	,	'header_mini_cart.tpl'

	,	'underscore'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'Utils'
	]
,	function (
		LiveOrderModel
	,	HeaderMiniCartSummaryView
	,	HeaderMiniCartItemCellView
	,	ProfileModel
	,	Configuration
	,	Tracker

	,	header_mini_cart_tpl

	,	_
	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	)
{
	'use strict';

	// @class Header.MiniCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_mini_cart_tpl

		//@property {Object} attributes List of HTML attributes applied by Backbone into the $el
	,	attributes: {
			'id': 'Header.MiniCart.View'
		,	'data-root-component-id': 'Header.MiniCart.View'
		}
	,	events: {
			'click [data-touchpoint="checkout"]': 'trackEvent'
		}

	,	initialize: function initialize ()
		{
			BackboneCompositeView.add(this);

			var self = this;

			this.isLoading = true;
			this.itemsInCart = 0;

			this.model = LiveOrderModel.getInstance();

			LiveOrderModel.loadCart().done(function ()
			{
				self.isLoading = false;
				self.render();
			});

			this.model.on('change', this.render, this);
			this.model.get('lines').on('add remove', this.render, this);
		}

	,	trackEvent: function ()
		{
			Tracker.getInstance().trackProceedToCheckout();
		}

	,	render: function render ()
		{
			this.itemsInCart = this.model.getTotalItemCount();

			Backbone.View.prototype.render.apply(this, arguments);

			//on tablet or desktop make the minicart dropdown
			if ( _.isTabletDevice() || _.isDesktopDevice() || SC.CONFIGURATION.addToCartBehavior === "showMiniCart")
			{
				this.$('[data-type="mini-cart"]').attr('data-toggle', 'dropdown');
			}

		}

	,	destroy: function destroy ()
		{
			this._destroy();

			this.model.off('change', this.render, this);
			this.model.get('lines').off('add remove', this.render, this);
		}

	,	childViews: {
			'Header.MiniCartSummary': function()
			{
				return new HeaderMiniCartSummaryView();
			}
		,	'Header.MiniCartItemCell': function()
			{
				return new BackboneCollectionView({
					collection: !this.isLoading ? this.model.get('lines') : new Backbone.Collection()
				,	childView: HeaderMiniCartItemCellView
				,	viewsPerRow: 1
				});
			}
		}

		// @method getContext
		// @return {Header.MiniCart.View.Context}
	,	getContext: function()
		{
			var summary = this.model.get('summary');

			// @class Header.MiniCart.View.Context
			return {
				// @property {LiveOrder.Model} model
				model: this.model
				// @property {Number} itemsInCart
			,	itemsInCart: this.itemsInCart
				// @property {Boolean} showPluraLabel
			,	showPluraLabel: this.itemsInCart !== 1
				// @property {Boolean} showLines
			,	showLines: this.itemsInCart > 0
				// @property {Boolean} isLoading
			,	isLoading: this.isLoading
				// @property {String} subtotalFormatted
			,	subtotalFormatted: !this.isLoading ? (summary && summary.subtotal_formatted) : ''
				// @property {String} cartTouchPoint
			,	cartTouchPoint: Configuration.get('modulesConfig.Cart.startRouter', false) ? Configuration.get('currentTouchpoint') : 'viewcart'
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
			};
			// @class Header.MiniCart.View
		}
	});

});
