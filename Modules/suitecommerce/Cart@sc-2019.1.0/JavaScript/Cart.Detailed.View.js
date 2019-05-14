/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Cart
define('Cart.Detailed.View'
,	[	'Backbone.CompositeView'
	,	'GlobalViews.Message.View'
	,	'Backbone.CollectionView'
	,	'Backbone.FormView'

	,	'Cart.Lines.View'
	,	'Cart.Lines.Free.View'
	,	'Cart.Promocode.Notifications.View'

	,	'Cart.Summary.View'
	,	'Cart.Item.Summary.View'
	,	'Cart.Item.Actions.View'
	,	'SC.Configuration'
	,	'LiveOrder.Model'
	,	'Tracker'

	,	'cart_detailed.tpl'
	,	'cart_lines_free.tpl'

	,	'Utils'
	,	'underscore'
	,	'Backbone'

	,	'jQuery'
	,	'jQuery.scStickyButton'
	]
,	function (
		BackboneCompositeView
	,	GlobalViewsMessageView
	,	BackboneCollectionView
	,	BackboneFormView

	,	CartLinesView
	,	CartLinesFreeView
	,	CartPromocodeNotifications

	,	CartSummaryView
	,	CartItemSummaryView
	,	CartItemActionsView
	,	Configuration
	,	LiveOrderModel
	,	Tracker

	,	cart_detailed_tpl
	,	cart_lines_free_tpl

	,	Utils
	,	_
	,	Backbone

	,	jQuery
	)
{
	'use strict';

	var colapsibles_states = {};

	// @class Cart.Detailed.View This is the Shopping Cart view @extends Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: cart_detailed_tpl

	,	enhancedEcommercePage: true

		// @property {String} title
	,	title: _('Shopping Cart').translate()

		// @property {String} page_header
	,	page_header: _('Shopping Cart').translate()

		// @property {Object} attributes
	,	attributes: {
			'id': 'Cart.Detailed.View'
		,	'data-root-component-id': 'Cart.Detailed.View'
		}

	,	bindings: {
			'[name="zip"]': 'zip'
		}

		// @property {Object} events
	,	events: {
			'change [data-type="cart-item-quantity-input"]': 'debouncedUpdateItemQuantity'
		,	'keypress [data-type="cart-item-quantity-input"]': 'debouncedUpdateItemQuantity'
		,	'submit [data-action="update-quantity"]': 'updateItemQuantityFormSubmit'
		,	'click [data-action="remove-item"]': 'removeItem'

		,	'submit form[data-action="estimate-tax-ship"]': 'estimateTaxShip'
		,	'click [data-action="remove-shipping-address"]': 'removeShippingAddress'
		,	'click [data-touchpoint="checkout"]': 'trackEvent'
		,	'change [data-action="estimate-tax-ship-country"]': 'changeCountry'
		}

		// @method initialize
		// @param {Cart.Detailed.View.InitializeParameters} options
		// @return {Void}
	,	initialize: function (options)
		{
			this.application = options.application;
			this.showEstimated = false;
			this.model = LiveOrderModel.getInstance();
			this.options.model = this.model;
			BackboneFormView.add(this);

			this.model.on('change', this.render, this);
			this.model.get('lines').on('add remove', this.render, this);
			this.model.on('LINE_ROLLBACK', this.render, this);
			this.model.on('promocodeNotificationShown', this.removePromocodeNotification, this);

			this.on('afterCompositeViewRender', this.resetColapsiblesState, this);
			this.on('afterCompositeViewRender', this.initPlugins, this);

			this.urlOptions = Utils.parseUrlOptions((options.routerArguments && options.routerArguments[0]) || '');
		}
	,	beforeShowContent: function ()
		{
			return LiveOrderModel.loadCart()
				.done(function ()
				{
					Tracker.getInstance().trackPageviewForCart('/' + Backbone.history.fragment);
				});
		}

		// @method getBreadcrumbPages
		// @return {BreadcrumbPage}
	,	getBreadcrumbPages: function ()
		{
			return {href: '/cart', text: _('Shopping Cart').translate()};
		}

		// @method initPlugins
		// initialize plugins
	,	initPlugins: function initPlugins()
		{
			if (Configuration.get('siteSettings.sitetype') === 'ADVANCED')
			{
				this.$('[data-action="sticky"]').scStickyButton();
			}


			Utils.initBxSlider(this.$('[data-type="carousel-items"]'), Configuration.get('bxSliderDefaults'));
		}

	,	render: function render ()
		{
			this.storeColapsiblesState();

			this._render();

			return this;
		}
		// @method hideError
	,	hideError: function hideError(selector)
		{
			var el = (selector)? selector.find('[data-type="alert-placeholder"]') : this.$('[data-type="alert-placeholder"]');
			el.empty();
		}

		// @method showError
	,	showError: function showError (message, line, error_details)
		{
			var placeholder;

			this.hideError();

			if (line)
			{
				// if we detect its a rolled back item, (this i an item that was deleted
				// but the new options were not valid and was added back to it original state)
				// We will move all the references to the new line id
				if (error_details && error_details.status === 'LINE_ROLLBACK')
				{
					var new_line_id = error_details.newLineId;

					line.attr('id', new_line_id);

					line.find('[name="internalid"]').attr({
						id: 'update-internalid-' + new_line_id
					,	value: new_line_id
					});
				}

				placeholder = line.find('[data-type="alert-placeholder"]');
				this.hideError(line);
			}
			else
			{
				placeholder = this.$('[data-type="alert-placeholder"]');
				this.hideError();
			}

			// Finds or create the placeholder for the error message
			if (!placeholder.length)
			{
				placeholder = jQuery('<div/>', {'data-type': 'alert-placeholder'});
				this.$el.children().first().prepend(placeholder);
			}

			var global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'error'
				,	closable: true
			});

			// Renders the error message and into the placeholder
			placeholder.append(global_view_message.render().$el.html());

			// Re Enables all posible disableded buttons of the line or the entire view
			if (line)
			{
				line.find(':disabled').attr('disabled', false);
			}
			else
			{
				this.$(':disabled').attr('disabled', false);
			}
		}

		// @method validInputValue
		// Check if the input[type="number"] has empty string or NaN value
		// input.val() == '' && validInput == false: NaN
		// input.val() == '' && validInput == true: empty string
	,	validInputValue: function(input)
		{
			// html5 validation
			if ((input.validity) && (!input.validity.valid) || input.value === '')
			{
				return false;
			}

			// Fallback to browsers that don't yet support html5 input validation
			return !isNaN(input.value);
		}

		// @method updateItemQuantity
		// Finds the item in the cart model, updates its quantity and saves the cart model
	,	updateItemQuantity: function updateItemQuantity(e)
		{
			var self = this
			,	$line = null
			,	$form = jQuery(e.target).closest('form')
			,	options = $form.serializeObject()
			,	internalid = options.internalid
			,	line = this.model.get('lines').get(internalid)
			,	$input = $form.find('[name="quantity"]')
			,	validInput = this.validInputValue($input[0]);

			if (!line || this.isRemoving)
			{
				return;
			}

			if (!validInput || options.quantity)
			{
				var	new_quantity = parseInt(options.quantity, 10)
				,	item = line.get('item')
				,	min_quantity = item ? item.get('_minimumQuantity', true) : line.get('minimumquantity')
				,	max_quantity = item ? item.get('_maximumQuantity', true) : line.get('maximumquantity')
				,	current_quantity = parseInt(line.get('quantity'), 10);

				new_quantity = (new_quantity >= min_quantity) ? new_quantity : current_quantity;

				new_quantity = (!!max_quantity && new_quantity > max_quantity) ? current_quantity : new_quantity;

				$input.val(new_quantity);

				if (new_quantity !==  current_quantity)
				{

					$input.val(new_quantity).prop('disabled', true);
					line.set('quantity', new_quantity);

					var invalid = line.validate();

					if (!invalid)
					{
						var update_promise = this.model.updateLine(line, true);

						this.disableElementsOnPromise(update_promise, '#' + internalid + ' button');

						update_promise.fail(function (jqXhr)
						{
							var result = JSON.parse(jqXhr.responseText)
							,	errorDetails = result.errorDetails;

							if (errorDetails.newLineId) {
								internalid = errorDetails.newLineId;
								// we use the new line
								line = self.model.get('lines').get(internalid);
							}

							// revert quantity to the last quantity
							line.set('quantity', current_quantity);
							self.render();

							$line = self.$('#' + (internalid));
							self.showError(result.errorMessage, $line, result.errorDetails);
						}).always(function ()
						{
							$input.prop('disabled', false);
						});
					}
					else
					{
						var placeholder = this.$('#' + internalid + ' [data-type="alert-placeholder"]');
						placeholder.empty();

						_.each(invalid, function(value)
						{
							var global_view_message = new GlobalViewsMessageView({
									message: value
								,	type: 'error'
								,	closable: true
							});

							placeholder.append(global_view_message.render().$el.html());
						});

						$input.prop('disabled', false);
						line.set('quantity', current_quantity);
					}
				}
			}
		}

	,	debouncedUpdateItemQuantity: _.debounce(function(e)
		{
			this.updateItemQuantity(e);
		}, 1000)

		// @method updateItemQuantityFormSubmit
	,	updateItemQuantityFormSubmit: function updateItemQuantityFormSubmit(e)
		{
			e.preventDefault();
			this.updateItemQuantity(e);
		}

		// @method removeItem
		// handles the click event of the remove button
		// removes the item from the cart model and saves it.
	,	removeItem: function removeItem(e)
		{
			var self = this
			,	product = this.model.get('lines').get(this.$(e.target).data('internalid'))
			,	remove_promise = this.model.removeLine(product)
			,	internalid = product.get('internalid');

			this.isRemoving = true;

			this.disableElementsOnPromise(remove_promise, 'article[id="' + internalid + '"] a, article[id="' + internalid + '"] button');

			remove_promise.always(function ()
				{
					self.isRemoving = false;
				});

			return remove_promise;
		}

		// @method estimateTaxShip
		// Sets a fake address with country and zip code based on the options.
	,	estimateTaxShip: function estimateTaxShip(e)
		{
			e.preventDefault();

			var options = this.$(e.target).serializeObject()
			,	self = this;

			var fake_address = {
				zip: options.zip
			,	country: options.country
			};

			this.model.cancelableTrigger('before:LiveOrder.estimateShipping', fake_address)
			.then(function()
			{
				var address_internalid = fake_address.zip + '-' + fake_address.country + '-null';
				fake_address.internalid = address_internalid;
				self.model.get('addresses').push(fake_address);

				self.model.set('shipaddress', address_internalid);

				var promise = self.saveForm(e);

				if (promise)
				{
					self.swapEstimationStatus();
				}

				promise.done(function(lines)
				{
					self.model.cancelableTrigger('after:LiveOrder.estimateShipping', _.isUndefined(lines) ? false : lines);
				});

			});
		}

		// @method changeEstimationStatus
	,	swapEstimationStatus: function swapEstimationStatus ()
		{
			this.showEstimated = !this.showEstimated;
		}

		// @method removeShippingAddress
		// sets a fake null address so it gets removed by the backend
	,	removeShippingAddress: function removeShippingAddress(e)
		{
			var self = this
			,	ship_address = self.model.get('addresses');

			self.model.cancelableTrigger('before:LiveOrder.clearEstimateShipping', ship_address)
			.then(function()
			{
				e.preventDefault();

				self.swapEstimationStatus();

				self.model.save({
					shipmethod: null
				,	shipaddress: null
				});

				self.model.cancelableTrigger('after:LiveOrder.clearEstimateShipping', true);
			});
		}

		// @method changeCountry
	,	changeCountry: function changeCountry(e)
		{
			e.preventDefault();

			var options = this.$(e.target).serializeObject()
			,	AddressModel = this.model.get('addresses').model;

			this.model.get('addresses').add(new AddressModel({ country: options.country, internalid: options.country }));
			this.model.set({ shipaddress: options.country });

		}

		// @method resetColapsiblesState
		// @return {Void}
	,	resetColapsiblesState: function resetColapsiblesState()
		{
			var self = this;
			_.each(colapsibles_states, function (is_in, element_selector)
			{
				self.$(element_selector)[ is_in ? 'addClass' : 'removeClass' ]('in').css('height',  is_in ? 'auto' : '0');
			});
		}

		// @method storeColapsiblesState
		// @return {Void}
	,	storeColapsiblesState: function ()
		{
			this.$('.collapse').each(function (index, element)
			{
				colapsibles_states[Utils.getFullPathForElement(element)] = jQuery(element).hasClass('in');
			});
		}

		// @method removePromocodeNotification
		// @param String promocode_id
		// @return {Void}
	,	removePromocodeNotification: function(promocode_id)
		{
			var promocode = _.findWhere(this.model.get('promocodes'), {internalid: promocode_id});

			delete promocode.notification;
		}

	,	trackEvent: function ()
		{
			Tracker.getInstance().trackProceedToCheckout();
		}

	,	destroy: function ()
		{
			colapsibles_states = {};

			this.model.off('change', this.render, this);
			this.model.get('lines').off('add remove', this.render, this);
			this.model.off('LINE_ROLLBACK', this.render, this);

			this.off('afterCompositeViewRender', this.resetColapsiblesState, this);
			this.off('afterCompositeViewRender', this.initPlugins, this);

			this._destroy();
		}

		// @property {ChildViews} childViews
	,	childViews: {
				'Cart.Summary': function ()
				{
					return new CartSummaryView({
						model: this.model
					,	showEstimated: this.showEstimated
					,	application: this.application
					});
				}
			,	'Item.ListNavigable': function ()
				{
					var lines = _.filter(this.model.get('lines').models || [], function (line) { return line.get('free_gift') !== true; });

					return new BackboneCollectionView({
							collection: lines
						,	viewsPerRow: 1
						,	childView: CartLinesView
						,	childViewOptions: {
								navigable: true
							,	application: this.application
							,	SummaryView: CartItemSummaryView
							,	ActionsView: CartItemActionsView
							,	showAlert: false
							}
					});
				}

			,	'Promocode.Notifications': function ()
				{
					var promotions = _.filter(this.model.get('promocodes') || [], function (promocode) { return promocode.notification === true; });

					if(promotions.length){
						return new BackboneCollectionView({
							collection: promotions
						,	viewsPerRow: 1
						,	childView: CartPromocodeNotifications
						,	childViewOptions: {
								parentModel: this.model
							}
						});
					}
				}

			,	'Item.FreeGift': function ()
				{
					var free_gifts = _.filter(this.model.get('lines').models || [], function (line) { return line.get('free_gift') === true; });

					if(free_gifts.length){
						return new BackboneCollectionView({
								collection: free_gifts
							,	viewsPerRow: 1
							,	childView: CartLinesFreeView
							,	childViewOptions: {
								navigable: true
							}
						});
					}
				}
			,	'FreeGift.Info': function ()
				{
					var message
					,	free_gifts = _.filter(this.model.get('lines').models || [], function (line) { return line.get('free_gift') === true; });

					if(free_gifts.length === 1){
						message = _.translate('The following item is free but it may generate shipping costs.');
					}
					else if (free_gifts.length > 1)
					{
						message = _.translate('The following items are free but they may generate shipping costs.');
					}

					if(message)
					{
						return new GlobalViewsMessageView({
							message: message
						,	type: 'info'
						,	closable: false
						});
					}
				}
		}

		//@method getExtraChildrenOptions Overridable method used to add params to url to open the accordion
		//@return {Cart.Detailed.View.ExtraChildrenOptions}
	,	getExtraChildrenOptions: function ()
		{
			//@class Cart.Detailed.View.ExtraChildrenOptions
			return {
				// @property {String} urlOptions
				urlOptions: this.urlOptions
			};
			//@class Cart.Detailed.View
		}

		// @method getContext @return {Cart.Detailed.View.Context}
	,	getContext: function ()
		{
			var lines = this.model.get('lines')
			,	product_count = lines.length
			,	item_count = _.reduce(lines.models, function(memo, line){ return memo + line.get('quantity'); }, 0)
			,	product_and_items_count = '';

			if (product_count === 1)
			{
				if (item_count === 1)
				{
					product_and_items_count =  _('1 Product, 1 Item').translate();
				}
				else
				{
					product_and_items_count = _('1 Product, $(0) Items').translate(item_count);
				}
			}
			else
			{
				if (item_count === 1)
				{
					product_and_items_count = _('$(0) Products, 1 Item').translate(product_count);
				}
				else
				{
					product_and_items_count = _('$(0) Products, $(1) Items').translate(product_count, item_count);
				}
			}

			// @class Cart.Detailed.View.Context
			return {

					//@property {LiveOrder.Model} model
					model: this.model
					//@property {Boolean} showLines
				,	showLines: !!(lines && lines.length)
					//@property {Orderline.Collection} lines
				,	lines: lines
					//@property {String} productsAndItemsCount
				,	productsAndItemsCount: product_and_items_count
					//@property {Number} productCount
				,	productCount: product_count
					//@property {Number} itemCount
				,	itemCount: item_count
					//@property {String} pageHeader
				,	pageHeader: this.page_header
			};
			// @class Cart.Detailed.View
		}
	});
});
