/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.MiniCartItemCell.View'
,	[
		'Transaction.Line.Views.Options.Selected.View'
	,	'Profile.Model'

	,	'header_mini_cart_item_cell.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	]
,	function (
		TransactionLineViewsOptionsSelectedView
	,	ProfileModel

	,	header_mini_cart_item_cell_tpl

	,	Backbone
	,	BackboneCompositeView
	)
{
	'use strict';

	// @class Header.MiniCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_mini_cart_item_cell_tpl

	,	initialize: function ()
		{
			BackboneCompositeView.add(this);
		}

	,	childViews: {
			'Item.SelectedOptions': function ()
			{
				return new TransactionLineViewsOptionsSelectedView({
					model:this.model
				});
			}
		}

		// @method getContext
		// @return {Header.MiniCart.View.Context}
	,	getContext: function ()
		{
			var price_container_object = this.model.getPrice();

			// @class Header.MiniCart.View.Context
			return {
				line: this.model
				//@property {Number} itemId
			,	itemId: this.model.get('item').id
				//@property {String} itemType
			,	itemType: this.model.get('item').get('itemtype')
				//@property {String} linkAttributes
			,	linkAttributes: this.model.getFullLink({quantity:null,location:null,fulfillmentChoice:null})
				// @property {ImageContainer} thumbnail
			,	thumbnail: this.model.getThumbnail()
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
				// @property {Boolean} isFreeGift
			,	isFreeGift: this.model.get('free_gift') === true 
				// @property {String} rateFormatted
			,	rateFormatted: price_container_object.price_formatted || this.model.get('rate_formatted') || ''
			};
			// @class Header.MiniCart.View
		}
	});
});