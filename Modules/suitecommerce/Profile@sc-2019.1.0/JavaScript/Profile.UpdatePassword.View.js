/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Profile
define(
	'Profile.UpdatePassword.View'
,	[
		'GlobalViews.Message.View'
	,	'Backbone.FormView'
	,	'SC.Configuration'
	,	'Profile.Model'
	,	'Profile.UpdatePassword.Model'
	,	'profile_update_password.tpl'

	,	'Backbone'
	,	'underscore'	
	,	'Utils'
	]
,	function (
		GlobalViewsMessageView
	,	BackboneFormView
	,	Configuration
	,	ProfileModel
	,	UpdatePasswordModel
		
	,	profile_update_password_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Profile.UpdatePassword.View @extends Backbone.View
	return Backbone.View.extend({

		template: profile_update_password_tpl

	,	page_header: _('Update Your Password').translate()

	,	title: _('Update Your Password').translate()

	,	attributes: {
			'id': 'PasswordUpdate'
		,	'class': 'ProfileUpdateYourPasswordView'
		}

	,	events: {
			'submit form': 'saveForm'
		,	'change form:has([data-action="reset"])': 'toggleReset'
		,	'keyup form:has([data-action="reset"])': 'toggleReset'
		,	'click [data-action="reset"]': 'resetForm'
		}

	,	bindings: {
			'[name="current_password"]': 'current_password'
		,	'[name="password"]': 'password'			
		,	'[name="confirm_password"]': 'confirm_password'	
		} 

	,	initialize: function()
		{
			this.model = new UpdatePasswordModel({});

			// merge the profile model into the UpdatePasswordModel
			this.model.set(ProfileModel.getInstance().attributes);
			this.model.on('saveCompleted', _.bind(this.resetForm, this));
			BackboneFormView.add(this);
			this.useLayoutError = true;
			this.model.on('save', this.showSuccess, this);
		}

	,	resetForm: function (event)
		{
			this.model.unset('current_password');
			this.model.unset('password');
			this.model.unset('confirm_password');

			event && event.preventDefault();
		}

	,	showSuccess: function ()
		{
			if (this.$savingForm)
			{
				var global_view_message = new GlobalViewsMessageView({
						message: _('Password successfully updated!').translate()
					,	type: 'success'
					,	closable: true
				});
				
				this.$('[data-type="alert-placeholder"]').html(global_view_message.render().$el.html());
			}
		}

		//@method getSelectedMenu
	,	getSelectedMenu: function ()
		{
			return 'updateyourpassword';
		}
		//@method getBreadcrumbPages
	,	getBreadcrumbPages: function ()
		{
			return {
				text: this.title
			,	href: '/updateyourpassword'
			};
		}

		// @method getContext @return Profile.UpdatePassword.View.Context
	,	getContext: function()
		{
			// @class Profile.UpdatePassword.View.Context
			return {
				// @property {String} pageHeader 
				pageHeader: this.page_header
				//@property {Boolean} showBackToAccount
			,	showBackToAccount: Configuration.get('siteSettings.sitetype') === 'STANDARD'
			};
		}
	});
});