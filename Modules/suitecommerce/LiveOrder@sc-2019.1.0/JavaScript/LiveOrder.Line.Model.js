/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Transaction
define('LiveOrder.Line.Model'
,	[
		'Transaction.Line.Model'
	,	'Item.Model'
	,	'underscore'
	,	'Utils'
	]
,	function (
		TransactionLineModel
	,	ItemModel
	,	_
	)
{
	'use strict';

	var LiveOrderLineModel = TransactionLineModel.extend(
		{
			urlRoot: _.getAbsoluteUrl('services/LiveOrder.Line.Service.ss')

		,	initialize: function initialize ()
			{
				// call the initialize of the parent object, equivalent to super()
				TransactionLineModel.prototype.initialize.apply(this, arguments);

				this.on('error', function (model, jqXhr)
				{
					var result = JSON.parse(jqXhr.responseText)
					,	error_details = result.errorDetails;

					if (error_details && error_details.status === 'LINE_ROLLBACK')
					{
						model.set('internalid', error_details.newLineId);
					}
				});

			}
			// @method toJSON Override default method to send only require data to the back-end
			// @return {Transaction.Line.Model.JSON}
		,	toJSON: function toJSON ()
			{

				// @class Transaction.Line.Model.JSON Class used to send a transaction line representation to the back-end
				// without sending all the heavy weight JSON that is not totally needed by the back-end
				// @public @extlayer
				return {
					// @property {Transaction.Line.Model.JSON.Item} item @public @extlayer
					// @class Transaction.Line.Model.JSON.Item  @public @extlayer
					item: {
						// @property {String} internalid @public @extlayer
						internalid: this.getItemId()
						// @property {String} type @public @extlayer
					,	type: this.attributes.item.get('itemtype')
					}
					// @class Transaction.Line.Model.JSON
					// @property {Number} quantity @public @extlayer
				,	quantity: this.attributes.quantity
					// @property {String} internalid @public @extlayer
				,	internalid: this.attributes.internalid
					// @property {Arra<Object>} options @public @extlayer
				,	options: this.get('options').toJSON()
					// @property {Number} splitquantity @public @extlayer
				,	splitquantity: this.attributes.splitquantity
					// @property {Number} shipaddress @public @extlayer
				,	shipaddress: this.attributes.shipaddress
					// @property {Number} shipmethod @public @extlayer
				,	shipmethod: this.attributes.shipmethod
					// @property {Number} location @public @extlayer
				,	location: this.attributes.location && this.attributes.location.attributes && this.attributes.location.attributes.internalid || ''
					// @property {String} fulfillmentChoice @public @extlayer
				,	fulfillmentChoice: this.attributes.fulfillmentChoice || 'ship'
					//@property {Boolean} freeGift
				,	freeGift: this.attributes.free_gift === true
				};
				//@class Transaction.Line.Model
			}

			// @method isEqual Compares two LiveOrder lines and answer if they are the same
			// We are extending Transaction.Line.Model here; this method overrides the namesake one in this model.
			// This is so because if pickup in store is enabled, we need to differentiate between lines that look the same but has different delivery methods
			// @param {Transaction.Line.Model} other_line
			// @return {Boolean}
		,	isEqual: function isEqual (other_line)
			{
				return !!(other_line && this.getItemId() === other_line.getItemId() &&
					_.isEqual(this.get('options').toJSON(), other_line.get('options').toJSON()) &&
					(this.get('location') && this.get('location').get('internalid')) === (other_line.get('location') && other_line.get('location').get('internalid')) &&
					this.get('fulfillmentChoice') === other_line.get('fulfillmentChoice') );
			}
		}

	,	{
			// @method createFromProduct
			// @param {Product.Model} product
			// @return {LiveOrder.Line.Model}
			createFromProduct: function createFromProduct (product)
			{
				var line = new LiveOrderLineModel(product.toJSON())
				,	item = product.get('item')
				,	item_images_detail = item.get('itemimages_detail')
				,	is_matrix_item = !!item.get('_matrixChilds').length;

				if (_.isEqual(item_images_detail, {}) && item.get('_matrixParent').get('internalid') && item.get('_matrixParent').get('itemimages_detail'))
				{
					item_images_detail = item.get('_matrixParent').get('itemimages_detail');
				}

				line.set('item', product.getItem().clone(), {silent:true});
				line.get('item').set('itemimages_detail', item_images_detail, {silent:true});
				line.get('item').set('itemid', item.get('itemid'), {silent:true});
				line.set('rate_formatted', product.getPrice().price_formatted, {silent:true});

				product.get('options').each(function (product_option)
				{
					var line_option = line.get('options').findWhere({cartOptionId: product_option.get('cartOptionId')});
					line_option.attributes = _.extend({}, product_option.attributes, line_option.attributes);
				});

				if (is_matrix_item)
				{
					line.get('item').set('matrix_parent', product.get('item'));
				}

				return line;
			}
		
			// @method createFromOuterLine Creates a LiveOrder.Line.Model from the outer representation of a line exposed by Extensibility Layer
			// @param {Line} outer_line
			// @return {LiveOrder.Line.Model}
		,	createFromOuterLine: function createFromOuterLine (outer_line)
			{
				var item = outer_line.item;
				
				outer_line = _.extend(outer_line, outer_line.extras);
				delete outer_line.extras;
				
				item = _.extend(item, item.extras);
				delete item.extras;
				outer_line.item = item;
				
				var new_line = new LiveOrderLineModel(outer_line);
				return new_line;
			}
		}
	);

	return LiveOrderLineModel;
});
