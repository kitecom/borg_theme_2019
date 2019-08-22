/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module OrderWizard.Module.PaymentMethod
define(
	'OrderWizard.Module.PaymentMethod.Selector'
,	[	'Wizard.Module'
	,	'OrderWizard.Module.PaymentMethod.Creditcard'
	,	'OrderWizard.Module.PaymentMethod.Invoice'
	,	'OrderWizard.Module.PaymentMethod.PayPal'
	,	'OrderWizard.Module.PaymentMethod.Others'
	,	'OrderWizard.Module.PaymentMethod.External'
	,	'SC.Configuration'
	,	'Tracker'

	,	'order_wizard_paymentmethod_selector_module.tpl'
	,	'order_wizard_paymentmethod_others_module.tpl'

	,	'underscore'
	,	'jQuery'
	]
,	function (
		WizardModule
	,	OrderWizardModulePaymentMethodCreditcard
	,	OrderWizardModulePaymentMethodInvoice
	,	OrderWizardModulePaymentMethodPayPal
	,	OrderWizardModulePaymentMethodOthers
	,	OrderWizardModulePaymentMethodExternal
	,	Configuration
	,	Tracker

	,	order_wizard_paymentmethod_selector_module_tpl
	,	order_wizard_paymentmethod_others_module_tpl

	,	_
	,	jQuery
	)
{
	'use strict';

	//@class OrderWizard.Module.PaymentMethod.Selector @extends Wizard.Module
	return WizardModule.extend({
		//@property {Function} template
		template: order_wizard_paymentmethod_selector_module_tpl
		//@property {String} className
	,	className: 'OrderWizard.Module.PaymentMethod.Selector'
		//@property {Object} selectedPaymentErrorMessage
	,	selectedPaymentErrorMessage: {errorCode: 'ERR_CHK_SELECT_PAYMENT', errorMessage: _('Please select a payment option').translate()}
		//@property {Object} externalPaymentErrorMessage
	,	externalPaymentErrorMessage: {errorCode: 'ERR_CHK_EXTERNAL_PAYMENT_FAIL', errorMessage: _('Payment processing failed. Try again or choose a different payment method.').translate()}
		//@property {Boolean} showExternalPaymentErrorMessage
	,	showExternalPaymentErrorMessage: true
		//@property {Array} errors
	,	errors: ['ERR_CHK_SELECT_PAYMENT', 'ERR_WS_SET_PAYMENT', 'ERR_CHK_EXTERNAL_PAYMENT_FAIL', 'ERR_WS_INVALID_PAYMENT']
		//@property {Object} events
	,	events: {
			'change [data-action="select-payment-method"]': 'selectPaymentMethod'
		,	'click [data-action="change-payment-method"]': 'selectPaymentMethod'
		,	'change [name="paymentmethod-external-option"]': 'selectPaymentMethodExternal'
		,	'click [name="paymentmethod-external-option"]': 'selectPaymentMethodExternal'
		}
		//@method initialize
	,	initialize: function (options)
		{
			var self = this;
			WizardModule.prototype.initialize.apply(this, arguments);

			this.external = [];

			this.modules = options.modules || [
				{
					classModule: OrderWizardModulePaymentMethodCreditcard
				,	name: _('Credit / Debit Card').translate()
				,	type: 'creditcard'
				,	options: {}
				}
			,	{
					classModule: OrderWizardModulePaymentMethodInvoice
				,	name: _('Invoice').translate()
				,	type: 'invoice'
				,	options: {}
				}
			,	{
					classModule: OrderWizardModulePaymentMethodPayPal
				,	name: _('PayPal').translate()
				,	type: 'paypal'
				,	options: {}

				}
			];

			if (!options.disableExternalPaymentMethods)
			{
				var payment_methods = Configuration.get('siteSettings.paymentmethods', [])
				,	payment_methods_configuration = Configuration.get('paymentmethods', [])
				,	external_payment_methods = _.where(payment_methods, {isexternal: 'T'});

				if(external_payment_methods.length)
				{
					_.each(external_payment_methods, function (payment_method)
					{
						var payment_method_configuration = _.find(payment_methods_configuration, {key: payment_method.key});

						self.external.push(
							self.getExternalPaymentMethodModule(payment_method, options, payment_method_configuration)
						);
					});
					//BC deprecate: check if template exists to load external payments old way
					if(!!order_wizard_paymentmethod_others_module_tpl)
					{
						this.modules.push(
						{
							classModule: OrderWizardModulePaymentMethodOthers
						,	name: _('Others').translate()
						,	type: 'others'
						,	options: _.extend(this.options, {external: this.external, selector: this})

						});
					}else{
						this.modules = _.union(this.modules, this.external);
					}

					this.wizard.model.on('change:confirmation', function (model, confirmation)
					{
						if (confirmation && confirmation.statuscode === 'redirect')
						{
							window.location.href = _.addParamsToUrl(confirmation.redirecturl, {touchpoint: Configuration.get('currentTouchpoint')});
							throw new Error('This is not an error. This is just to abort javascript');
						}
					});
				}
			}

			_.each(this.modules, function (module)
			{
				// var ModuleClass = require(module.classModule);
				var ModuleClass = module.classModule;
				module.instance = new ModuleClass(_.extend({
					wizard: self.wizard
				,	step: self.step
				,	stepGroup: self.stepGroup
				}, module.options));

				module.instance.on('ready', function (is_ready)
				{
					self.moduleReady(is_ready);
				});
			});

		}

	,	getExternalPaymentMethodModule: function (payment_method, options, payment_method_configuration)
		{
			return 	{
				classModule: OrderWizardModulePaymentMethodExternal
			,	name: payment_method.name
			,	type: 'external_checkout_' + payment_method.key
			,	options: {
						paymentmethod: payment_method
					,	thankyouurl: options.external_checkout_thank_you_url
					,	errorurl:  options.external_checkout_error_url
					,	description: payment_method_configuration ? payment_method_configuration.description : ''
					,	record_type: options.record_type
					,	prevent_default: options.prevent_default
				}
			};
		}

	,	isOthersModule: function (type)
		{
			return (type.indexOf('external') !== -1) && !!order_wizard_paymentmethod_others_module_tpl;
		}

		//@method moduleReady
	,	moduleReady: function (is_ready)
		{
			this.trigger('ready', is_ready);
		}
		//@method past
	,	past: function()
		{
			this.state = 'past';
			if (!this.selectedModule)
			{
				var primary_paymentmethod = this.model.get('paymentmethods').findWhere({primary: true});
				this.setModuleByType(primary_paymentmethod && primary_paymentmethod.get('type'));
			}

			this.selectedModule && this.selectedModule.instance.past && this.selectedModule.instance.past();
			this.model.off('change', this.totalChange, this);
		}
		//@method present
	,	present: function()
		{
			this.state = 'present';
			this.selectedModule && this.selectedModule.instance.present && this.selectedModule.instance.present();


			this.model.off('change', this.totalChange, this);
			this.model.on('change', this.totalChange, this);
		}
		//@method future
	,	future: function()
		{
			this.state = 'future';
			this.selectedModule && this.selectedModule.instance.future && this.selectedModule.instance.future();
			this.model.off('change', this.totalChange, this);
		}
		//@method totalChange
	,	totalChange: function ()
		{
			if (this.model.previous('summary') && this.model.get('summary'))
			{
				var was = this.model.previous('summary').total
				,	is = this.model.get('summary').total;

				// Changed from or to 0
				if ((was === 0 && is !== 0) || (was !== 0 && is === 0))
				{
					this.render();
				}
			}

		}
		//@method setModuleByType
	,	setModuleByType: function (type, no_render)
		{

			Tracker.getInstance().trackSelectedPayment(type);

			this.selectedModule = _.findWhere(_.union(this.modules, this.external), {type: type});

			if (!this.selectedModule)
			{
				this.selectedModule = _.findWhere(this.modules, {isActive: true});
			}

			// set continue button label.
			if (this.selectedModule.type === 'paypal' && !this.model.get('isPaypalComplete'))
			{
				this.trigger('change_label_continue', _('Continue to Paypal').translate());
			}
			else
			{
				this.trigger('change_label_continue');
			}

			if (this.state === 'present' && !no_render)
			{
				this.render();
			}

		}
		//@method render
	,	render: function ()
		{
			if (this.wizard.hidePayment())
			{
				this.$el.empty();
				this.trigger('change_label_continue');
				return;
			}

			// We do this here so we give time for information to be bootstrapped
			_.each(this.modules, function (module)
			{
				module.isActive = module.instance.isActive();
			});


			if (!this.selectedModule)
			{
				var selected_payment = this.model.get('paymentmethods').findWhere({primary: true})
				,	selected_type;

				if (selected_payment)
				{
					selected_type = (this.isOthersModule(selected_payment.get('type'))) ? 'others' : selected_payment.get('type');
				}
				else if (this.wizard.options.profile.get('paymentterms'))
				{
					selected_type = 'invoice';
				}

				this.setModuleByType(selected_type, true);
			}
			else if (this.selectedModule.type === 'paypal' && !this.model.get('isPaypalComplete'))
			{
				this.trigger('change_label_continue', _('Continue to Paypal').translate());
			}
			else
			{
				this.trigger('change_label_continue');
			}




			if (_.getParameterByName(window.location.href, 'externalPayment') === 'FAIL' && this.showExternalPaymentErrorMessage)
			{
				this.showExternalPaymentErrorMessage = false;

				this.manageError(this.externalPaymentErrorMessage);
			}

			if (this.isOthersModule(this.selectedModule.type))
			{
				var other_module = _.findWhere(this.modules, ({type: 'others'}));

				other_module.isSelected = true;

				this.selectedModule = other_module;
				this._render();


				this.renderModule(other_module);

			}else{

				this._render();

				var selected_module = _.findWhere(this.modules, {isSelected: true})
				this.renderModule(selected_module)

			}


		}

	,	renderModule: function (module)
		{
			module.instance.isReady = false;
			module.instance.render();
			this.$('#payment-method-selector-content').empty().append(module.instance.$el);
		}

		//@method selectPaymentMethod
	,	selectPaymentMethod: function (e)
		{
			var value = e.target.getAttribute('value') || jQuery(e.target).val();
			if (value) {
				this.setModuleByType(value);
			}
		}

		//@method selectPaymentMethodExternal
	,	selectPaymentMethodExternal: function (e)
		{
			this.setModuleByType(e.target.getAttribute('value'), true);
		}

		//@method submit
	,	submit: function ()
		{
			this.clearError();
			// This order is bing payed with some other method (Gift Cert probably)
			if (this.wizard.hidePayment())
			{
				return jQuery.Deferred().resolve();
			}

			if (this.selectedModule && this.selectedModule.instance)
			{
				return this.selectedModule.instance.submit();
			}
			else
			{
				return jQuery.Deferred().reject(this.selectedPaymentErrorMessage);
			}
		}
		//@method isValid
	,	isValid: function ()
		{
			// This order is being payed with some other method (Gift Cert probably)
			if (this.wizard.hidePayment())
			{
				return jQuery.Deferred().resolve();
			}

			if (this.selectedModule && this.selectedModule.instance)
			{
				return this.selectedModule.instance.isValid();
			}
			else
			{
				return jQuery.Deferred().reject(this.selectedPaymentErrorMessage);
			}
		}
		//@method getContext
	,	getContext: function ()
		{
			var self = this
			,	active_modules = _.map(this.modules, function (module)
			{
				if (module.isActive)
				{
					module.isSelected = (self.selectedModule.type === module.type);
					module.isActive = true;
					return {
						isActive: true
					,	isSelected: module.isSelected
					,	name: module.name
					,	options: module.options
					,	type: module.type
					};
				}
			});

			active_modules =  _.compact(active_modules);
			return {
					//@property {Array} activeModules
					activeModules: _.compact(active_modules)
					//@property {Boolean} activeModulesLengthGreaterThan1
				,	activeModulesLengthGreaterThan1: active_modules.length
					//@property {String} firstActiveModuleName
				,	firstActiveModuleName: active_modules[0] && active_modules[0].name
					//@property {Boolean} showTitle
				,	showTitle: !this.options.hide_title
					//@property {String} title
				,	title: this.options.title || _('Payment Method').translate()
			};
		}
	});
});
