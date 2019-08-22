/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ProductDetails
define('ProductDetails.Component'
,	[
		'Product.Model'
	,	'SC.VisualComponent'

	,	'Utils'
	,	'underscore'
	,	'jQuery'
	]
,	function (
		ProductModel
	,	SCVisualComponent

	,	Utils
	,	_
	,	jQuery
	)
{
	'use strict';

	return function ProductDetailsComponentGenerator (application)
	{
		// @class ProductDetails.Component The ProductDetails component let's the user interact with most important aspect of the
		// Product Details Page, like setting options, changing quantity, and obtain item's related information. @extend SC.VisualComponent @public @extlayer
		var privateComponent = SCVisualComponent.extend({

				componentName: 'PDP'

			,	application: application

				// @method _isViewFromComponent Indicate if the passed-in the View is a PDP of the current component
				// @private
				// @param {Backbone.View} view Any view of the system
				// @return {Boolean} True in case the passed in View is a PDP of the current Component, false otherwise
			,	_isViewFromComponent: function _isViewFromComponent (view)
				{
					view = view || this.viewToBeRendered || this.application.getLayout().getCurrentView();

					var view_identifier = this._getViewIdentifier(view)
					,	view_prototype_id = view && this._getViewIdentifier(view.prototype)
					;

					return (view && ( view_identifier === this.PDP_FULL_VIEW || view_identifier === this.PDP_QUICK_VIEW ||
						view_prototype_id === this.PDP_FULL_VIEW || view_prototype_id === this.PDP_QUICK_VIEW
					));
				}

				// @method _getViewIdentifier Given a view that belongs to the current component, returns the "type"/"kind" of view. This is used to determine what view among all the view of the current component is being shown
				// @param {Backbone.View} view
				// @return {String}
			,	_getViewIdentifier: function _getViewIdentifier (view)
				{
					return view && view.attributes && view.attributes.id;
				}

			,	DEFAULT_VIEW: 'ProductDetails.Full.View'

			,	PDP_FULL_VIEW: 'ProductDetails.Full.View'

			,	PDP_QUICK_VIEW: 'ProductDetails.QuickView.View'

				// @method setOption Set an option of the current PDP. It will only work if the current view is a Product Details Page
				// @public @extlayer
				// @param {String} cart_option_id Identifier of the option
				// @param {String} value Optional value. In case of invalid or not specified value the option selected will be cleaned
				// @return {jQuery.Deferred<Boolean>} Indicate if the action was successful or not
			,	setOption: function setOption (cart_option_id, value)
				{
					try
					{
						if (!cart_option_id || !_.isString(cart_option_id))
						{
							return this._reportError('INVALID_PARAM', 'Invalid parameter "cart_option_id". It must be a valid string');
						}

						var current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

						if (this._isViewFromComponent(current_view, true))
						{
							return current_view.model.setOption(cart_option_id, value).then(function (operation_result)
								{
									return jQuery.Deferred().resolve(!!operation_result);
								}
							,	function ()
								{
									return jQuery.Deferred().resolve(false);

								});
						}

						return jQuery.Deferred().resolve(false);
					}
					catch(error)
					{
						return jQuery.Deferred().resolve(false);
					}
				}

				// @method setQuantity Set the quantity of the current PDP. If the current View is a PDP
				// @public @extlayer
				// @param {Number} quantity
				// @return {jQuery.Deferred<Boolean>} Indicate if the operation ended successfully
			,	setQuantity: function setQuantity (quantity)
				{
					try
					{
						var current_view;

						if (!_.isNumber(quantity))
						{
							return this._reportError('INVALID_PARAM', 'Invalid parameter "quantity". It must be a valid number');
						}
						else if (quantity <= 0)
						{
							return this._reportError('INVALID_PARAM', 'Parameter "quantity" must be greater than 0');
						}

						current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

						if (this._isViewFromComponent(current_view, true))
						{
							return current_view.model.set('quantity', quantity)
								.then(function ()
									{
										return jQuery.Deferred().resolve(true);
									}
								,	function ()
									{
										return jQuery.Deferred().resolve(false);
									});
						}

						return jQuery.Deferred().resolve(false);
					}
					catch(error)
					{
						return jQuery.Deferred().resolve(false);
					}
				}

				// @method getItemInfo Get a JSON representation of the current Model. If the current View is a PDP, null otherwise
				// @public @extlayer
				// @return {Transaction.Line.Model.JSON|null}
			,	getItemInfo: function getItemInfo ()
				{
					var current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

					if (this._isViewFromComponent(current_view, true))
					{
						return Utils.deepCopy(current_view.model);
					}

					return null;
				}

				// @method getSelectedMatrixChilds Filters all the child items that apply for the passed in matrix_options or the current item selection
				// If no option is sent, and there is no options selected, then it will return all the matrix child items.
				// @param {Product.OptionHelper.MatrixSelection} matrix_options
				// @return {Array<Item>} All the children of a matrix that complies with the current or passed in selection
			,	getSelectedMatrixChilds: function getSelectedMatrixChilds(matrix_options)
				{
					var current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

					if (this._isViewFromComponent(current_view, true))
					{
						return Utils.deepCopy(current_view.model.getSelectedMatrixChilds(matrix_options));
					}

					return null;
				}

				// @method getAllMatrixChilds Returns all the matrix child of the matrix item
				// @returns {Array<Item>} All the children of a matrix item
			,	getAllMatrixChilds: function getAllMatrixChilds()
				{
					var current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

					if (this._isViewFromComponent(current_view, true))
					{
						var item_matrix_children = current_view.model.get('item').get('_matrixChilds');
						return Utils.deepCopy(item_matrix_children.models);
					}
					return null;
				}

				// @method getStockInfo Returns information about the stock available of an item.
				// If it is an Inventory Item will return the stock available.
				// @return {Item.StockInfo}
			,	getStockInfo: function getStockInfo ()
				{
					var current_view = this.viewToBeRendered || application.getLayout().getCurrentView();

					if (this._isViewFromComponent(current_view, true))
					{
						return Utils.deepCopy(current_view.model.getStockInfo());
					}

					return null;
				}

			});

		var _normalizeChangeOptionBefore = function _normalizeChangeOptionBefore()
		{
			var option_cart_id = arguments[0]
			,	value = arguments[1];

			return {optionCartId: option_cart_id, value: value};
		};

		var innerToOuterMap = [
			// @event beforeOptionSelection Cancelable event triggered before an option is selected @public @extlayer
			{inner: 'beforeChangeOption', outer: 'beforeOptionSelection', normalize: _normalizeChangeOptionBefore}
			// @event afterOptionSelection Triggered after an option is selected @public @extlayer
		,	{inner: 'afterChangeOption', outer: 'afterOptionSelection', normalize: null}
			// @event beforeQuantityChange Cancelable event triggered before the quantity is changed @public @extlayer
		,	{inner: 'beforeChangeQuantity', outer: 'beforeQuantityChange', normalize: null}
			// @event afterQuantityChange @public Triggered after the quantity is changed. @extlayer
		,	{inner: 'afterChangeQuantity', outer: 'afterQuantityChange', normalize: null}
			// @event beforeImageChange Cancelable event triggered before the main image displayed in the Details page changes. @public @extlayer
		,	{inner: 'beforeChangeImage', outer: 'beforeImageChange', normalize: null}
			// @event afterImageChange Triggered after the main image displayed in the Details page changes. @public @extlayer
		,	{inner: 'afterChangeImage', outer: 'afterImageChange', normalize: null}
		];

		application.getLayout().on('beforeAppendView', function onApplicationBeforeAppendView (view)
		{
			if (privateComponent._isViewFromComponent(view, true))
			{
				privateComponent._suscribeToInnerEvents(innerToOuterMap, view.model);
			}
		});

		return privateComponent;
	};
});
