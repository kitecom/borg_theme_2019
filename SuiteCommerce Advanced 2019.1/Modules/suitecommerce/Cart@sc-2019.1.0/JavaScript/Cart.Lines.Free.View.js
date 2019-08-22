/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Transaction.Line.Views
define('Cart.Lines.Free.View'
,	[
		'LiveOrder.Model'
	,	'Transaction.Line.Views.Price.View'
	,	'Transaction.Line.Views.Options.Selected.View'
	,	'ProductLine.Stock.View'
	,	'ProductLine.Sku.View'
	,	'ProductLine.StockDescription.View'

	,	'Transaction.Line.Views.Tax'
	,	'GlobalViews.Message.View'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'

	,	'cart_lines_free.tpl'

	,	'Backbone'
	,	'underscore'

	,	'SC.Configuration'
	]
,	function (
		LiveOrderModel
	,	TransactionLineViewsPriceView
	,	TransactionLineViewsOptionsSelectedView
	,	ProductLineStockView
	,	ProductLineSkuView
	,	ProductLineStockDescriptionView

	,	TransactionLineViewsTax
	,	GlobalViewsMessageView

	,	BackboneCollectionView
	,	BackboneCompositeView

	,	cart_lines_free_tpl

	,	Backbone
	,	_

	,	Configuration
	)
{
	'use strict';

	//@class Cart.Lines.Free.View @extend Backbone.View
	return Backbone.View.extend({

		template: cart_lines_free_tpl

		//@method initialize
		//@param {Transaction.Line.Views.Cell.Actionable.Initialize.Options} options
		//@return {Void}
	,	initialize: function ()
		{
			BackboneCompositeView.add(this);

			this.cart = LiveOrderModel.getInstance();
		}
	,	events: {
			'click [data-action="plus"]': 'addQuantity'
		,	'click [data-action="minus"]': 'subQuantity'
		,	'click [data-action="remove-free-gift"]': 'removeGift'
		,	'change [data-type="cart-free-item-quantity-input"]': 'changeQuantity'
		}

		// @method addQuantity Add 1 to the quantity field
		// @return {Void}
	,	addQuantity: function ()
		{
			var old_value = this.$('[name="quantity"]').val()
			,	new_val = Math.min(this.model.get('free_gift_info').qtyelegible, parseFloat(old_value) + 1);

			this.$('[name="quantity"]').val(new_val);

			this.changeQuantity();
		}

		// @method subQuantity Subtract 1 from the quantity field
		// @return {Void}
	,	subQuantity: function ()
		{
			var old_value = this.$('[name="quantity"]').val()
			,	new_val = Math.max(1, parseFloat(old_value) - 1);

			this.$('[name="quantity"]').val(new_val);

			this.changeQuantity();
		}

	,	removeGift: function ()
		{
			this.cart.removeLine(this.model);
		}

	,	updateGift: function (quantity)
		{

			this.$('[name="quantity"]').prop('disabled', false);

			var line = this.model
			,	current_quantity = line.get('quantity');

			line.set('quantity', quantity);

			var invalid = line.validate()
			,	placeholder = this.$el.find('[data-type="alert-placeholder"]');

			placeholder.empty();

			if (!invalid)
			{
				this.cart.updateLine(line);
			}
			else
			{
				_.each(invalid, function(value)
				{
					var global_view_message = new GlobalViewsMessageView({
							message: value
						,	type: 'error'
						,	closable: true
					});

					placeholder.append(global_view_message.render().$el.html());
				});

				line.set('quantity', current_quantity);
			}

			this.$('[name="quantity"]').prop('disabled', false);
		}

	,	changeQuantity: _.debounce(function()
		{
			var	$input = this.$('[name="quantity"]')
			,	current_quantity = parseInt(this.model.get('quantity'), 10)
			,	new_quantity = ($input.val() <= this.model.get('free_gift_info').eligible_quantity && $input.val() > 0) ? parseInt($input.val()) : current_quantity;

			$input.val(new_quantity);

			if (new_quantity  && new_quantity !==  current_quantity)
			{
				this.updateGift(new_quantity);
			}

		}, 1000)

	,	childViews: {
			'Item.Price': function ()
			{
				return new TransactionLineViewsPriceView({
					model: this.model
				,	showComparePrice: true
				});
			}
		,	'Item.Sku': function ()
			{
				return new ProductLineSkuView({
					model: this.model
				});
			}
		,	'Item.SelectedOptions': function ()
			{
				return new TransactionLineViewsOptionsSelectedView({
					model: this.model
				});
			}
		,	'Product.Stock.Info': function ()
			{
				return new ProductLineStockView({
					model: this.model
				});
			}
		,	'Item.Tax.Info': function()
			{
				if(Configuration.get('showTaxDetailsPerLine'))
				{
					return new TransactionLineViewsTax({
						model: this.model
					});
				}
			}
		,	'StockDescription': function ()
			{
				return new ProductLineStockDescriptionView({
					model: this.model
				});
			}
		}

		//@method getContext
		//@return {Transaction.Line.Views.Actionable.View.Context}
	,	getContext: function ()
		{
			var item = this.model.get('item');

			//@class Transaction.Line.Views.Actionable.View.Context
			return {
					//@property {OrderLine.Model|Transaction.Line.Model} line
					line: this.model
					//@property {String} lineId
				,	lineId: this.model.get('internalid')
					//@property {Item.Model} item
				,	item: item
					//@property {String} itemId
				,	itemId: item.get('internalid')
					//@property {String} linkAttributes
				,	linkAttributes: this.model.getFullLink({quantity:null,location:null,fulfillmentChoice:null})
					//@property {Boolean} isNavigable
				,	isNavigable: !!this.options.navigable && !!item.get('_isPurchasable')
					// @property {ImageContainer} thumbnail
				,	thumbnail: this.model.getThumbnail()
					// @property {Boolean} isQtyEditable
				,	isQtyEditable: this.model.get('free_gift_info').eligible_quantity > 1
					// @property {Number} qtyElegible
				,	qtyElegible: this.model.get('free_gift_info').eligible_quantity
			};
			//@class Transaction.Line.Views.Actionable.View
		}
	});
});


//@class Cart.Lines.Initialize.Options
//@property {Transaction.Line.Model} model
//@property {String} generalClass Class name used in the generated HTML
//@property {Backbone.View} SummaryView View to show details
//@property {Backbone.View} ActionsView View to show actions buttons
//@property {Object} actionsOptions Any object used to extend the options sent to the Action View
//@property {Object} summaryOptions Any object used to extend the options sent to the Summary View
//@property {Boolean} navigable
//@property {Boolean} showAlert Indicate if a place holder is added in the final HTML, used when the action can generate errors
//@property {ApplicationSkeleton} application
//@property {Boolean} hideComparePrice Property used to bypass to the TransactionLineViewsPriceView
