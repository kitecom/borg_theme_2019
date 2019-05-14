/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Cart
define(
	'Cart.Component'
,	[
		'ICart.Component'
	,	'LiveOrder.Model'
	,	'LiveOrder.Line.Model'
	,	'Transaction.Paymentmethod.Model'
	,	'Utils'

	,	'Backbone'
	,	'jQuery'
	,	'underscore'
	]
,	function(
		ICartComponent
	,	LiveOrderModel
	,	LiveOrderLineModel
	,	TransactionPaymentmethodModel
	,	Utils


	,	Backbone
	,	jQuery
	,	_
	)
{
	'use strict';

	var live_order_model = LiveOrderModel.getInstance();

	return function CartComponentGenerator(application){

		// @class Cart.Component This is the concrete front-end Cart implementation of SuiteCommerce Advanced / SuiteCommerce Standard.
		// See @?class ICart.Component
		// @extends ICart.Component
		// @public @extlayer
		var api_methods = {

			application: application

			// @method _isViewFromComponent Indicate if the passed-in the View is a PDP of the current component
			// @private
			// @param {Backbone.View} view Any view of the system
			// @return {Boolean} True in case the passed in View is a PDP of the current Component, false otherwise
		,	_isViewFromComponent: function _isViewFromComponent(view)
			{
				view = view || this.viewToBeRendered || this.application.getLayout().getCurrentView();
				
				var view_identifier = this._getViewIdentifier(view)
				,	view_prototype_id = view && this._getViewIdentifier(view.prototype);

				return (view && ( view_identifier === this.CART_VIEW || view_identifier === this.CART_MINI_VIEW ||
					view_prototype_id === this.CART_VIEW || view_prototype_id === this.CART_MINI_VIEW
				));
			}

			// @method _getViewIdentifier Given a view that belongs to the current component, returns the "type"/"kind" of view.
			// This is used to determine what view among all the view of the current component is being shown
			// @private
			// @param {Backbone.View} view
			// @return {String}
		,	_getViewIdentifier: function _getViewIdentifier(view)
			{
				return view && view.attributes && view.attributes.id;
			}

		,	DEFAULT_VIEW: 'Cart.Detailed.View'

		,	CART_VIEW: 'Cart.Detailed.View'

		,	CART_MINI_VIEW: 'Header.MiniCart.View'

		,	estimateShipping: function estimateShipping(data)
			{
				try
				{
					if (!data || !data.address || !_.isObject(data.address))
					{
						return this._reportError('INVALID_PARAM', 'Invalid parameter "address". It must be a valid string');
					}

					var self = this;

					return live_order_model.cancelableTrigger('before:LiveOrder.estimateShipping', data.address)
					.then(function()
					{
						var address = data.address
						,	address_internalid = address.zip + '-' + address.country + '-null';

						live_order_model.get('addresses').push({
							internalid: address_internalid
						,	zip: address.zip
						,	country: address.country
						});

						live_order_model.set('shipaddress', address_internalid);

						return live_order_model.save()
						.pipe(function (result)
						{
							live_order_model.cancelableTrigger('after:LiveOrder.estimateShipping', result);
							return self._normalizeEstimateAfter(result);
						})
						.fail(function (error)
						{
							return error;
						});
					});
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	clearEstimateShipping: function clearEstimateShipping()
			{
				try
				{
					var self = this;

					return live_order_model.cancelableTrigger('before:LiveOrder.clearEstimateShipping')
					.then(function()
					{
						return live_order_model.save({
								shipmethod: null
							,	shipaddress: null
							})
							.pipe(function (result)
							{
								live_order_model.cancelableTrigger('after:LiveOrder.clearEstimateShipping', result);
								return self._normalizeEstimateAfter(result);
							})
							.fail(function (error)
							{
								return error;
							});
					});
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getShipMethods: function getShipMethods()
			{
				try
				{
					var	shipmethods = live_order_model.get('shipmethods').toJSON();

					return jQuery.Deferred().resolve(_.map(shipmethods, this._normalizeShipMethod));
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getShipMethod: function getShipMethod()
			{
				try
				{
					var shipmethod_id = live_order_model.get('shipmethod')
					,	shipmethods = live_order_model.get('shipmethods').toJSON();

					var shipmethod = _.find(shipmethods, function(shipmethod)
					{
						return shipmethod && shipmethod.internalid && shipmethod.internalid === shipmethod_id;
					});

					return jQuery.Deferred().resolve(this._normalizeShipMethod(shipmethod));
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	_setAddress: function _setAddress(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				this.serialize = this.serialize || jQuery.Deferred().resolve();

				this.serialize = this.serialize.pipe(function()
				{
					var my_promise = jQuery.Deferred();

					try
					{
						if(!Utils.isCheckoutDomain())
						{
							self._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
						}

						if (!_.isObject(data) || !_.isString(data.address_type))
						{
							self._reportError('INVALID_PARAM', 'Invalid parameter "address_type". It must be a valid string');
						}

						if (data.address_id && !_.isString(data.address_id))
						{
							self._reportError('INVALID_PARAM', 'Invalid parameter "address_id". It must be either a valid string or null');
						}

						live_order_model.setAddress(data.address_type, data.address_id, null, true)
						.done(deferred.resolve)
						.fail(deferred.reject)
						.always(my_promise.resolve);
					}
					catch(error)
					{
						deferred.reject(error);
						my_promise.resolve();
					}

					return my_promise;
				});

				return deferred;
			}

		,	setShipAddress: function setShipAddress(data)
			{
				data.address_type = 'shipaddress';
				return this._setAddress(data);
			}

		,	setBillAddress: function setBillAddress(data)
			{
				data.address_type = 'billaddress';
				return this._setAddress(data);
			}

		,	getShipAddress: function getShipAddress()
			{
				try
				{
					var shipaddress = live_order_model.get('shipaddress')
					,	addresses = live_order_model.get('addresses').toJSON();

					var address = _.find(addresses, function(address)
					{
						return address && address.internalid && address.internalid === shipaddress;
					});

					return jQuery.Deferred().resolve(this._normalizeAddress(address));
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getBillAddress: function getBillAddress()
			{
				try
				{
					var billaddress = live_order_model.get('billaddress')
					,	addresses = live_order_model.get('addresses').toJSON();

					var address = _.find(addresses, function(address)
					{
						return address && address.internalid && address.internalid === billaddress;
					});

					return jQuery.Deferred().resolve(this._normalizeAddress(address));
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	addLine: function addLine(data)
			{
				try
				{
					this._validateLine(data);

					var self = this
					,	deferred = jQuery.Deferred();

					this.serialize = this.serialize || jQuery.Deferred().resolve();

					this.serialize = this.serialize.pipe(function()
					{
						var my_promise = jQuery.Deferred();

						try
						{
							var	line = self._createInnerLine(data.line);

							live_order_model.addLine(line)
							.done(function(result)
							{
								deferred.resolve(result.latest_addition);
							})
							.fail(function(error)
							{
								deferred.reject(error);
							})
							.always(my_promise.resolve);
						}
						catch(error)
						{
							deferred.reject(error);
							my_promise.resolve();
						}

						return my_promise;
					});

					return deferred;
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	addLines: function addLines(data)
			{
				try
				{
					this._validateLines(data);

					var self = this
					,	deferred = jQuery.Deferred();

					this.serialize = this.serialize || jQuery.Deferred().resolve();

					this.serialize = this.serialize.pipe(function()
					{
						var my_promise = jQuery.Deferred();

						try
						{
							var	lines = _.map(data.lines, self._createInnerLine)
							,	old_lines_ids = _.pluck(live_order_model.get('lines').toJSON(), 'internalid');

							live_order_model.addLines(lines)
							.done(function(result)
							{
								var current_lines_ids = _.pluck(result.lines, 'internalid');

								result = _.difference(current_lines_ids, old_lines_ids);
								result = _.isEmpty(result) ? current_lines_ids : result;

								deferred.resolve(result);
							})
							.fail(function(error)
							{
								deferred.reject(error);
							})
							.always(my_promise.resolve);

						}
						catch(error)
						{
							deferred.reject(error);
							my_promise.resolve();
						}

						return my_promise;
					});

					return deferred;
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getLines: function getLines()
			{
				var deferred = jQuery.Deferred();

				try{
					var lines = this._normalizeLines(live_order_model.get('lines') || []);

					return deferred.resolve(lines);
				}
				catch(error)
				{
					return deferred.reject(error);
				}
			}

		,	removeLine: function removeLine(data)
			{
				try
				{
					this._validateLineId(data);

					var self = this
					,	deferred = jQuery.Deferred();

					this.serialize = this.serialize || jQuery.Deferred().resolve();

					this.serialize = this.serialize.pipe(function()
					{
						var my_promise = jQuery.Deferred();

						try
						{
							var	line = self._findLine(data.line_id);

							live_order_model.removeLine(line)
							.done(function()
							{
								deferred.resolve();
							})
							.fail(function(error)
							{
								deferred.reject(error);
							})
							.always(my_promise.resolve);
						}
						catch(error)
						{
							deferred.reject(error);
							my_promise.resolve();
						}

						return my_promise;
					});

					return deferred;
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	updateLine: function updateLine(data)
			{
				try
				{
					this._validateLine(data, true);

					var self = this
					,	deferred = jQuery.Deferred();

					this.serialize = this.serialize || jQuery.Deferred().resolve();

					this.serialize = this.serialize.pipe(function()
					{
						var my_promise = jQuery.Deferred();

						try
						{
							var	line = self._findLine(data.line.internalid);
							//Merge line with data.line
							self._mergeLine(line, data.line);

							live_order_model.updateLine(line)
							.done(function()
							{
								deferred.resolve();
							})
							.fail(function(error)
							{
								deferred.reject(error);
							})
							.always(my_promise.resolve);

						}
						catch(error)
						{
							deferred.reject(error);
							my_promise.resolve();
						}

						return my_promise;
					});

					return deferred;
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getSummary: function getSummary()
			{
				try
				{
					var summary = live_order_model.get('summary');
					summary = this._normalizeSummary(summary);

					return jQuery.Deferred().resolve(summary);
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	submit: function submit()
			{
				var self = this
				,	deferred = jQuery.Deferred();

				this.serialize = this.serialize || jQuery.Deferred().resolve();

				this.serialize = this.serialize.pipe(function()
				{
					var my_promise = jQuery.Deferred();

					try
					{
						if(!Utils.isCheckoutDomain())
						{
							self._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
						}

						live_order_model.submit()
						.done(function(order)
						{
							deferred.resolve(self._normalizeConfirmation(order.confirmation));
						})
						.fail(deferred.reject)
						.always(my_promise.resolve);
					}
					catch(error)
					{
						deferred.reject(error);
						my_promise.resolve();
					}

					return my_promise;
				});

				return deferred;
			}

		,	addPayment: function addPayment(data)
			{
				var self = this
				,	deferred = jQuery.Deferred();

				this.serialize = this.serialize || jQuery.Deferred().resolve();

				this.serialize = this.serialize.pipe(function()
				{
					var my_promise = jQuery.Deferred();

					try
					{
						if(!Utils.isCheckoutDomain())
						{
							self._reportError('UNSECURE_SESSION', 'Unsecure session: Must be under a secure domain or logged in');
						}

						if (!data || !_.isObject(data.payment_method))
						{
							self._reportError('INVALID_PARAM', 'Invalid parameter "payment_method". It must be a valid object');
						}

						var payment_method = self._createInnerPayment(data.payment_method);

						live_order_model.addPayment(payment_method, true)
						.done(function(result)
						{
							deferred.resolve(result);
						})
						.fail(deferred.reject)
						.always(my_promise.resolve);
					}
					catch(error)
					{
						deferred.reject(error);
						my_promise.resolve();
					}

					return my_promise;
				});

				return deferred;
			}

		,	getPaymentMethods: function getPaymentMethods()
			{
				try
				{
					var self = this
					,	payment_methods = live_order_model.get('paymentmethods').toJSON();

					return jQuery.Deferred().resolve(_.map(payment_methods, function(payment)
					{
						return self._normalizePaymentMethod(payment).payment_method;
					}));
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	addPromotion: function addPromotion(data)
			{
				try
				{
					if (!data || !_.isString(data.promocode))
					{
						this._reportError('INVALID_PARAM', 'Invalid parameter "promocode". It must be a valid string');
					}

					var self = this;

					return live_order_model.addPromotion(data.promocode)
					.pipe(function(promocode)
					{
						return {promotion: self._normalizePromocode(promocode)};
					});
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	removePromotion: function removePromotion(data)
			{
				try
				{
					if (!data || !_.isString(data.promocode_internalid))
					{
						this._reportError('INVALID_PARAM', 'Invalid parameter "promocode_internalid". It must be a valid string');
					}

					return live_order_model.removePromotion(data.promocode_internalid);
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	getPromotions: function getPromotions()
			{
				try
				{
					var promocodes = live_order_model.get('promocodes');
					promocodes = _.map(promocodes, this._normalizePromocode);

					return jQuery.Deferred().resolve(promocodes);
				}
				catch(error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		,	_createInnerPayment: function _createInnerPayment(payment_method)
			{
				var inner_payment = new TransactionPaymentmethodModel(payment_method);

				return inner_payment;
			}

		,	_findLine: function _findLine(internal_id)
			{
				var line = live_order_model.get('lines').find(function (cart_line)
				{
					return cart_line.get('internalid') === internal_id;
				});

				!line && this._reportError('INVALID ID', 'Line ' + internal_id + ' not found');

				return line;
			}

		,	_mergeLine: function _mergeLine(inner_line, line)
			{
				var self = this;

				_.each(line, function(value, index)
				{
					if(index === 'extras')
					{
						self._mergeLine(inner_line, value);
					}
					else if(_.contains(inner_line.keys(), index))
					{
						if(inner_line.get(index) instanceof Backbone.Model){
							self._mergeLine(inner_line.get(index), value);
						}
						else if (inner_line.get(index) instanceof Backbone.Collection)
						{
							inner_line.set(index, new Backbone.Collection(value));
						}
						else
						{
							inner_line.set(index, value);
						}
					}
				});
			}

		,	_createInnerLine: function _createInnerLine(line)
			{
				return LiveOrderLineModel.createFromOuterLine(line);
			}

		};

		//Wrap public methods to load the cart before its execution
		_.each(api_methods, function(api_method, name)
		{
			if(name.indexOf('_') !== 0 && _.isFunction(api_method))
			{
				api_methods[name] = _.wrap(api_method, function(fn)
				{
					var self = this
					,	args = _.toArray(arguments).slice(1);

					return LiveOrderModel.loadCart()
					.pipe(function()
					{	try
						{
							return fn.apply(self, args);
						}
					 	catch(error)
						{
							return jQuery.Deferred().reject(error);
						}
  					});	
					
				});
			}
		});

		//@class Cart.Component @extend ICart.Component
		var cart_component = ICartComponent.extend(api_methods);

		var innerToOuterMap = [
			// @class ICart.Component
			// @event beforeUpdateLine Cancelable event triggered before a cart's line is updated @public @extlayer
			{inner: 'before:LiveOrder.updateLine', outer: 'beforeUpdateLine', normalize: cart_component._normalizeUpdateLineBefore}
			// @event afterUpdateLine Triggered after a cart's line is updated @public @extlayer
		,	{inner: 'after:LiveOrder.updateLine', outer: 'afterUpdateLine', normalize: cart_component._normalizeUpdateLineAfter}
			// @event beforeRemoveLine Cancelable event triggered before a cart's line is removed @public @extlayer
		,	{inner: 'before:LiveOrder.removeLine', outer: 'beforeRemoveLine', normalize: cart_component._normalizeRemoveLineBefore}
			// @event afterRemoveLine Triggered after a cart's line is removed @public @extlayer
		,	{inner: 'after:LiveOrder.removeLine', outer: 'afterRemoveLine', normalize: cart_component._normalizeRemoveLineAfter}
			// @event beforeEstimateShipping Cancelable event triggered before doing an estimate shipping in the cart @public @extlayer
		,	{inner: 'before:LiveOrder.estimateShipping', outer: 'beforeEstimateShipping', normalize: cart_component._normalizeEstimateBefore}
			// @event afterEstimateShipping Triggered after an estimate shipping is done in the cart @public @extlayer
		,	{inner: 'after:LiveOrder.estimateShipping', outer: 'afterEstimateShipping', normalize: cart_component._normalizeEstimateAfter}
			// @event beforeClearEstimateShipping Cancelable event triggered before clearing an estimate shipping in the cart @public @extlayer
		,	{inner: 'before:LiveOrder.clearEstimateShipping', outer: 'beforeClearEstimateShipping', normalize: cart_component._normalizeClearEstimateShippingBefore}
			// @event afterClearEstimateShipping Triggered after an estimate shipping is cleared in the cart @public @extlayer
		,	{inner: 'after:LiveOrder.clearEstimateShipping', outer: 'afterClearEstimateShipping', normalize: cart_component._normalizeClearEstimateShippingAfter}
			// @event beforeAddPromotion Triggered before a promotion is added to the cart @public @extlayer
		,	{inner: 'before:LiveOrder.addPromotion', outer: 'beforeAddPromotion', normalize: cart_component._normalizePromocode}
			// @event afterAddPromotion Triggered after a promotion is added to the cart @public @extlayer
		,	{inner: 'after:LiveOrder.addPromotion', outer: 'afterAddPromotion', normalize: cart_component._normalizePromocode}
			// @event beforeRemovePromotion Triggered before a promocode is removed from the cart @public @extlayer
		,	{inner: 'before:LiveOrder.removePromotion', outer: 'beforeRemovePromotion', normalize: cart_component._normalizePromocode}
			// @event afterRemovePromotion Triggered after a promocode is removed from the cart @public @extlayer
		,	{inner: 'after:LiveOrder.removePromotion', outer: 'afterRemovePromotion', normalize: cart_component._normalizePromocode}
			// @event beforeAddPayment Triggered before a payment method is added to the order @public @extlayer
		,	{inner: 'before:LiveOrder.addPayment', outer: 'beforeAddPayment', normalize: cart_component._normalizePaymentMethod}
			// @event afterAddPayment Triggered after a payment method is added to the order @public @extlayer
		,	{inner: 'after:LiveOrder.addPayment', outer: 'afterAddPayment', normalize: cart_component._normalizePaymentMethod}

			// @event beforeSubmit Triggered before the order is submited @public @extlayer
		,	{inner: 'before:LiveOrder.submit', outer: 'beforeSubmit', normalize: null}
			// @event afterSubmit Triggered after the order is submited @public @extlayer
		,	{inner: 'after:LiveOrder.submit', outer: 'afterSubmit', normalize: cart_component._normalizeConfirmation}

		];

		cart_component._suscribeToInnerEvents(innerToOuterMap, live_order_model);

		live_order_model.cancelableOn('before:LiveOrder.setAddress', function(address)
		{
			var outer_events = {
					shipaddress: 'beforeSetShipAddress'
				,	billaddress: 'beforeSetBillAddress'
				}
			,	outer_event = outer_events[address.type];

			return cart_component.cancelableTrigger(outer_event, address.id);
		});

		live_order_model.cancelableOn('after:LiveOrder.setAddress', function(address)
		{
			var outer_events = {
					shipaddress: 'afterSetShipAddress'
				,	billaddress: 'afterSetBillAddress'
				}
			,	outer_event = outer_events[address.type];

			return cart_component.cancelableTrigger(outer_event, address.id);
		});

		live_order_model.cancelableOn('before:LiveOrder.addLines', function(lines)
		{
			var lines_deferred = _.map(lines, function(line)
			{
				var args = cart_component._normalizeAddLineBefore(line);
				// @event beforeAddLine Cancelable event triggered before adding a new cart's line @public @extlayer
				return cart_component.cancelableTrigger('beforeAddLine', args);
			});

			return jQuery.when.apply(jQuery, lines_deferred);
		});

		live_order_model.cancelableOn('after:LiveOrder.addLines', function(old_lines, current_lines)
		{
			var old_lines_ids = cart_component._normalizeLines(old_lines)
			,	current_lines_ids = cart_component._normalizeLines(current_lines)
			,	new_lines = _.difference(current_lines_ids, old_lines_ids);

			new_lines = _.isEmpty(new_lines) ? current_lines_ids : new_lines;

			var lines_deferred = _.map(new_lines, function(line)
			{
				var args = cart_component._normalizeAddLineAfter(line.internalid, line);
				// @event afterAddLine Triggered after a new line is added in the cart @public @extlayer
				return cart_component.cancelableTrigger('afterAddLine', args);
			});

			return jQuery.when.apply(jQuery, lines_deferred);
		});

		// @class Cart.Component
		return cart_component;
	};

});
