/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Notifications
define(
	'Notifications.Profile.View'
,	[
		'Profile.Model'
	,	'GlobalViews.Message.View'
	,	'Session'

	,	'notifications_profile.tpl'

	,	'Backbone'
	,	'Backbone.CompositeView'

	,	'underscore'
	]
,	function(
		ProfileModel
	,	GlobalViewsMessageView
	,	Session

	,	notifications_profile_tpl

	,	Backbone
	,	BackboneCompositeView

	,	_
	)
{
	'use strict';

	// @class Notifications.Profile.View @extends Backbone.View
	return Backbone.View.extend({

		template: notifications_profile_tpl

	,	initialize: function ()
		{
		}

	,	render: function ()
		{
			this.model = ProfileModel.getInstance();

			if (Session.get('email_change_verification', false))
			{
				this.message = {
					text: SC.SESSION.email_change_verification === 'true' ? _('Your email has been changed successfully to <strong>').translate() + this.model.get('email') + '</strong>' : SC.SESSION.email_change_verification
				,	type: SC.SESSION.email_change_verification === 'true' ? 'success' : 'error'
				};
				delete SC.SESSION.email_change_verification;
			}
			else if (SC.ENVIRONMENT.email_verification_error)
			{
				this.message = {
					text: _('The validation process has failed. Please login into your account and click on the validation link again.').translate()
				,	type: 'error'
				};
				delete SC.ENVIRONMENT.email_verification_error;
			}
			else if (SC.ENVIRONMENT.password_reset_invalid_error)
			{
				this.message = {
					text: _('Your reset password link is invalid. Request a new one using the Forgot Password link.').translate()
				,	type: 'error'
				};
				delete SC.ENVIRONMENT.password_reset_invalid_error;
			}
			else if (SC.ENVIRONMENT.password_reset_expired_error)
			{
				this.message = {
					text: _('Your reset password link has expired. Request a new one using the Forgot Password link.').translate()
				,	type: 'error'
				};
				delete SC.ENVIRONMENT.password_reset_expired_error;
			}
			else if (SC.ENVIRONMENT.reset_password_confirmation_email)
			{
				this.message = {
					text: _('Please check your email and get instructions on how to reset your password.').translate()
				,	type: 'success'
				};
				delete SC.ENVIRONMENT.reset_password_confirmation_email;
			}
			else if (SC.ENVIRONMENT.updated_password_confirmation)
			{
				this.message = {
					text: _('Your password has been reset.').translate()
				,	type: 'success'
				};
				delete SC.ENVIRONMENT.updated_password_confirmation;
			}

			this._render();
		}

		// @property {ChildViews} childViews
	,	childViews: {
			'ProfileChanges.Notifications': function ()
			{
				if (this.message)
				{
					return new GlobalViewsMessageView({
							message: this.message.text
						,	type: this.message.type
						,	closable: true
					});
				}
			}
		}

		// @method getContext @return Notifications.Order.View.Context
	,	getContext: function ()
		{
			//@class Notifications.Order.View.Context
			return {};
		}
	});
});
