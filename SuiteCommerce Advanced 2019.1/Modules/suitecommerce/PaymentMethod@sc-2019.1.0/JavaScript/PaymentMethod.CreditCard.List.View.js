/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module CreditCard
define('PaymentMethod.CreditCard.List.View'
,	[
		'paymentmethod_creditcard_list.tpl'
	,	'creditcard_list.tpl'

	,	'Backbone.CollectionView'
	,	'Backbone.CompositeView'
	,	'CreditCard.View'
	,	'PaymentInstrument.CreditCard.View'
	,	'SC.Configuration'
	,	'GlobalViews.Confirmation.View'
	,	'Profile.Model'


	,	'backbone_collection_view_cell.tpl'
	,	'backbone_collection_view_row.tpl'
	,	'paymentinstrument_creditcard_edit.tpl'
	
	,	'Backbone'
	,	'underscore'
	,	'LiveOrder.Model'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		paymentmethod_creditcard_list_tpl
	,	creditcard_list_tpl

	,	BackboneCollectionView
	,	BackboneCompositeView
	,	CreditCardView
	,	PaymentInstrumentCreditCardView
	,	Configuration
	,	GlobalViewsConfirmationView
	,	ProfileModel


	,	backbone_collection_view_cell_tpl
	,	backbone_collection_view_row_tpl
	,	paymentinstrument_creditcard_edit_tpl

	,	Backbone
	,	_
	,	LiveOrderModel
	,	jQuery
	)
{
	'use strict';

	// @class CreditCard.List.View @extends Backbone.View
	return Backbone.View.extend({

	//	template: creditcard_list_tpl
		title: _('Payment Methods').translate()
	,	page_header: _('Payment Methods').translate()

	,	attributes: {
			'id': 'PaymentMethodCreditCardsList'
		,	'class': 'PaymentMethodCreditCardListView'
		}

	,	events: {
			'click [data-action="remove"]': 'removeCreditCard'
		}

	,	initialize: function ()
		{

			this.template = paymentmethod_creditcard_list_tpl || creditcard_list_tpl;

			this.profileModel = ProfileModel.getInstance();
			this.collection = this.profileModel.get('paymentmethods');

			this.collection.on('reset sync add remove change', function ()
			{
				if (this.collection.length)
				{
					this.collection.sort();
					this.render();
				}
				else
				{
					Backbone.history.navigate('#creditcards/new', { trigger: true });
				}
			}, this);
		}

	,	beforeShowContent: function beforeShowContent()
		{
			var promise = jQuery.Deferred();

			if (this.profileModel.get('isLoggedIn') !== 'T')
			{
				promise.reject();
				this.application.getLayout().notFound();
			}
			else if (!this.collection.length)
			{
				promise.reject();
				Backbone.history.navigate('#creditcards/new', {trigger: true});
			}
			else
			{
				promise.resolve();
			}

			return promise;
		}

		// @method getPaymentMethodsToShow returns a copy of the payment methods collection including the new card button available to show
	,	getPaymentMethodsToShow: function ()
	{
		var payment_methods_to_show;

		if (this.collection && !!this.collection.length)
		{
			payment_methods_to_show = paymentinstrument_creditcard_edit_tpl ? this.collection.getCollectionForRendering() : this.collection;
		}

		return payment_methods_to_show ? payment_methods_to_show.models : [];
	}

	,	childViews: {
			'CreditCards.Collection': function ()
			{
				var view = (!!SC.ENVIRONMENT.paymentInstrumentEnabled) ? PaymentInstrumentCreditCardView : CreditCardView
				,	view_collection;

				if (!paymentinstrument_creditcard_edit_tpl) 
				{
					view_collection = new BackboneCollectionView({
						collection: this.getPaymentMethodsToShow()
					,	childView: view
					,	childViewOptions :{
							showActions: true
						,	hideSelector: true
						,	showDefaults: Configuration.get('currentTouchpoint') === 'customercenter'
						}
					,	viewsPerRow: Configuration.get('itemsPerRow', 2)
					});
				} 
				else 
				{
					view_collection = new BackboneCollectionView({
						collection: this.getPaymentMethodsToShow()
					,	childView: view
					,	childViewOptions :{
							showActions: true
						,	hideSelector: true
						,	showDefaults: Configuration.get('currentTouchpoint') === 'customercenter'
						}
					,	viewsPerRow: Configuration.get('itemsPerRow') || (_.isDesktopDevice() ? 3 : _.isTabletDevice() ? 2 : 1)
					,	cellTemplate: backbone_collection_view_cell_tpl
					,	rowTemplate: backbone_collection_view_row_tpl
					});
				}

				return view_collection;
			}
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'creditcards';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
				text: _('Payment Methods').translate()
			,	href: '/creditcards'
			};
		}

		//@method removeCreditCard dispatch the remove event
	,	removeCreditCard: function (e)
		{
			e.preventDefault();

			var deleteConfirmationView = new GlobalViewsConfirmationView({
					callBack: this._removeCreditCardFromCollection
				,	callBackParameters: {
						context: this
					,	creditcardId: jQuery(e.target).data('id')
					}
				,	title: _('Remove Credit Card').translate()
				,	body: _('Are you sure you want to remove this Credit Card?').translate()
				,	autohide: true
				});

			return this.options.application.getLayout().showInModal(deleteConfirmationView);
		}

	,	_removeCreditCardFromCollection: function (options)
		{
			options.context.collection.get(options.creditcardId).destroy({ wait: true });
		}

		//@method getContext @return {CreditCard.List.View.Context}
	,	getContext: function ()
		{
			//@class CreditCard.List.View.Context
			return {
				//@property {String} pageHeader
				pageHeader: this.page_header
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
			};
		}
	});
});
