/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module OrderWizard
define(
	'OrderWizard.Module.PaymentMethod.Others'
,	[
		'OrderWizard.Module.PaymentMethod'
	,	'OrderWizard.Module.PaymentMethod.External'
	,	'Transaction.Paymentmethod.Model'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'GlobalViews.Message.View'

	,	'order_wizard_paymentmethod_others_module.tpl'
	,	'backbone_collection_view_cell.tpl'
	,	'backbone_collection_view_row.tpl'

	,	'Backbone'
	,	'underscore'
	,	'SC.Configuration'
	,	'Utils'
	]
,	function (
		OrderWizardModulePaymentMethod
	,	OrderWizardModulePaymentMethodExternal
	,	TransactionPaymentmethodModel
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	GlobalViewsMessageView

	,	order_wizard_paymentmethod_others_module_tpl
	,	backbone_collection_view_cell_tpl
	,	backbone_collection_view_row_tpl

	,	Backbone
	,	_
	,	Configuration
	,	Utils
	)
{
	'use strict';

	// @class OrderWizard.Module.PaymentMethod.Others @extends OrderWizard.Module.PaymentMethod
	return OrderWizardModulePaymentMethod.extend({

		template: order_wizard_paymentmethod_others_module_tpl

	,	events: {
			'click [data-action="select"]' : 'setSelectedExternalId'
		}

	,	initialize: function (options)
		{

			OrderWizardModulePaymentMethod.prototype.initialize.apply(this, arguments);

			BackboneCompositeView.add(this);

			var self = this;

			_.each(this.options.external, function (module)
						{
				// var ModuleClass = require(module.classModule);
				var ModuleClass = module.classModule;
				module.instance = new ModuleClass(_.extend({
					wizard: self.wizard
				,	step: self.step
				,	stepGroup: self.stepGroup
				}, module.options));

			});
		}

	,	setSelectedExternalId: function (e)
		{
			this.options.selectedExternalId = jQuery(e.target).data('id');
			this.options.selector.setModuleByType(this.options.selectedExternalId, true);
			this.render();
		}

	,	childViews:
		{
			'Others.List': function ()
				{
					return new BackboneCollectionView({
						collection: this.options.external
					,	childView: OrderWizardModulePaymentMethodExternal
					,	viewsPerRow: this.itemsPerRow || (_.isDesktopDevice() ? 3 : _.isTabletDevice() ? 2 : 1)
					,	cellTemplate: backbone_collection_view_cell_tpl
					,	rowTemplate: backbone_collection_view_row_tpl
					,	childViewOptions: this.options

					});
				}
		,	'External.Description': function()
		{
				return new GlobalViewsMessageView({
							message: _.translate('You will be <b>redirected to your external payment site</b> after reviewing your order <b>on next step</b>. Once your order is placed, you <b>will return to our site to see the confirmation</b> of your purchase.')
						,	type: 'info'
						,	closable: false
					});
		}
		}
	});
});