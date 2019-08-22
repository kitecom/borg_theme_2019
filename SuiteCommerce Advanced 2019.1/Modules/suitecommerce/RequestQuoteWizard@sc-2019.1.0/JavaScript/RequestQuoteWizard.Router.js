/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module RequestQuoteWizard
define('RequestQuoteWizard.Router'
,	[
		'Wizard.Router'
	,	'RequestQuoteWizard.View'
	,	'RequestQuoteWizard.Step'
	,	'RequestQuoteWizard.Permission.Error.View'

	,	'AjaxRequestsKiller'

	,	'Backbone'
	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]
,	function (
		WizardRouter
	,	RequestQuoteWizardView
	,	RequestQuoteWizardStep
	,	RequestQuoteWizardPermissionErrorView

	,	AjaxRequestsKiller

	,	Backbone
	,	_
	,	jQuery
	,	Utils
	)
{
	'use strict';

	// @class RequestQuoteWizard.Router @extends Wizard.Router
	return WizardRouter.extend({
		//@property {RequestQuoteWizardStep.Step} step
		step: RequestQuoteWizardStep

		//@property {RequestQuoteWizardStep.View} view
	,	view: RequestQuoteWizardView

	,	initialize: function ()
		{
			var init_promise = WizardRouter.prototype.initialize.apply(this, arguments);
			
			this.application.waitForPromise(init_promise);
		}

	,	_registerPageType: function _registerPageType(options)
		{
			var pageType = this.application.getComponent('PageType');

			pageType.registerPageType({
				'name': 'request-quote-wizard'
			,	'routes': options.routes
			,	'view': RequestQuoteWizardView
			,	'defaultTemplate': {
					'name': 'requestquote_wizard_layout.tpl'
				,	'displayName': 'Request quote wizard default'
				,	'thumbnail': Utils.getAbsoluteUrl('img/default-layout-request-quote-wizard.png')
				}
			});
		}

		//@method runStep override default runstep method to validate that a quote id has been specified in the URL and the corresponding quote is already loaded
		//@return {Void}
	,	runStep: function ()
		{
			// Computes the position of the user in the flow
			var fragments = Backbone.history.fragment.split('?')
			,	url = fragments[0]
			,	str_options = fragments.length ? fragments[1] : ''
			,	position = this.getStepPosition(url) //this.getStepPosition(url)
			,	content = ''
			,	page_header = ''
			,	layout = this.application.getLayout()
			,	options = _.parseUrlOptions(str_options)
			,	self = this
			,	quoteid = str_options && ~str_options.indexOf('quoteid=')
			,	promise = jQuery.Deferred();

			if (SC.ENVIRONMENT.permissions.transactions.tranEstimate < 2)
			{
				var error_view = new RequestQuoteWizardPermissionErrorView({
					application: this.application
				});

				error_view.showContent();

				return promise.reject();
			}
			else if (quoteid)
			{
				//wizard just finished and user refreshed the page
				page_header = _('Your Quote Request has been Placed').translate();
				content += _('You can review your quote request at <a href="/quotes/$(0)">Your Account</a> ')
					.translate(options.quoteid) +
					_('or continue Shopping on our <a data-touchpoint="home" data-hashtag="#/" href="/">Home Page</a>.').translate();

				layout.internalError && layout.internalError(content, page_header, _('My Account').translate());

				return promise.reject();
			}
			else if (position.fromBegining === 0)
			{
				self.model.clear();
				//this is done because many OrderWizard Modules dont check if the summary is set
				self.model.set('summary', {}, {silent: true});
				self.model.set('internalid', 'null');

				return self.model.fetch(
					{
						killerId: AjaxRequestsKiller.getKillerId()
					})
					.then(function ()
					{
						self.model.trigger('init');
						return WizardRouter.prototype.runStep.apply(self);
					});
			}
			else
			{
				return WizardRouter.prototype.runStep.apply(self, arguments);
			}
		}

	});
});
