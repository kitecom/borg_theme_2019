/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Case.Detail.View.js
// -----------------------
// Views for viewing Cases list.
// @module Case
define(
	'Case.Detail.View'
,	[
		'SC.Configuration'
	,	'Profile.Model'
	,	'Case.Fields.Model'
	,	'Case.Model'
	,	'AjaxRequestsKiller'
	,	'Backbone.FormView'

	,	'case_detail.tpl'

	,	'jQuery'
	,	'Backbone'
	,	'underscore'
	]
,	function (
		Configuration
	,	ProfileModel
	,	CaseFieldsModel
	,	CaseModel
	,	AjaxRequestsKiller
	,	BackboneFormView

	,	case_detail_tpl

	,	jQuery
	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Case.Details.View @extends Backbone.View
	return Backbone.View.extend({
		template: case_detail_tpl

	,	title: _('Case Details').translate()

	,	bindings: {
			'[name="reply"]': 'reply'
		}

	,	initialize: function (options)
		{
			this.application = options.application;
			this.fields = new CaseFieldsModel();
			this.user = ProfileModel.getInstance();
			this.model = new CaseModel({ internalid: options.routerArguments[0] });

			BackboneFormView.add(this);
			this.model.on('saveCompleted', _.bind(this.alertOnSave, this));
		}

	,	beforeShowContent: function()
		{
			return jQuery.when(
				this.model.fetch({
					killerId: AjaxRequestsKiller.getKillerId()
				})
			,	this.fields.fetch({
					killerId: AjaxRequestsKiller.getKillerId()
				})
			);
		}
		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'cases';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return [
				{
					text: _('Support Cases').translate()
				,	href: '/cases'
				}
			,	{
					text: _('Case #$(0)').translate(this.model.get('internalid'))
				,	href: '/case/' + this.model.get('internalid')
				}
			];
		}

	,	events: {
			'submit form': 'saveForm'
		,	'click [data-action="reset"]': 'resetForm'
		,	'click [data-action="close-case"]': 'closeCase'
		}

	,	alertOnSave : function()
		{
			this.showContent();
			this.showConfirmationMessage(_('Good! Your message was sent. A support representative should contact you briefly.').translate());
			jQuery('#reply').val('');
		}

	,	attributes: {
			'class': 'caseDetail'
		}

	,	closeCase: function (event)
		{
			event.preventDefault();
			
			var self = this;

			this.model.set('isClosing', true);
			this.model.set('reply', '');
			this.model.set('status', { id: SC.ENVIRONMENT.CASES_CONFIG.defaultValues.statusClose.id });
			this.model.save().done(function()
			{
				self.model.set('isClosing', false);
				self.showContent();
				self.showConfirmationMessage(_('Case successfully closed').translate());
				jQuery('#reply').val('');
			});
		}

	,	resetForm: function (e)
		{
			e.preventDefault();
			this.showContent();
		}

		// @method getContext @return Case.Details.View.Context
	,	getContext: function()
		{
			// @class Case.Details.View.Context
			return {
				// @property {Case.Model} model
				model: this.model
				// @property {String} pageHeader
			,	pageHeader: _('Case #$(0):').translate(this.model.get('caseNumber'))
				// @property {Boolean} collapseElements
			,	collapseElements: Configuration.get('sca.collapseElements')
				// @property {Boolean} closeStatusId
			,	closeStatusId: this.model.get('status').id !== SC.ENVIRONMENT.CASES_CONFIG.defaultValues.statusClose.id
			};
		}
	});
});
