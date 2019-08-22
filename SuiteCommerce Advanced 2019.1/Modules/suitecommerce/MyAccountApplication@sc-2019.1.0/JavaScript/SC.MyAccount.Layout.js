/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module MyAccountApplication
define(
	'SC.MyAccount.Layout'
,	[
		'ApplicationSkeleton.Layout'
	,	'MenuTree.View'

	,	'myaccount_layout.tpl'
	,	'Backbone'
	,	'underscore'
	,	'Utils'
	]
,	function(
		ApplicationSkeletonLayout
	,	MenuTreeView

	,	myaccount_layout_tpl
	,	Backbone
	,	_
	,	Utils
	)
{
	'use strict';
	//@class SCA.MyAccount.Layout @extends ApplicationSkeleton.Layout
	return ApplicationSkeletonLayout.extend({

		//@property {Function} template
		template: myaccount_layout_tpl

	,	className: 'layout-container'

	,	initialize: function ()
		{
			ApplicationSkeletonLayout.prototype.initialize.apply(this, arguments);

			var self = this;
			var menuTree = MenuTreeView.getInstance();
			this.on('afterAppendView', function(view){
				var selected_menu = self.getSelectedMenu(view);

				menuTree.updateSidebar(selected_menu);

				self.updateLayoutSB(selected_menu);
			});
		}
		//@method updateLayoutSB

	,	updateLayoutSB: function (selected_menu)
		{
			this.selectedMenu = selected_menu || this.selectedMenu;

			if (this.application.getConfig('siteSettings.sitetype') === 'STANDARD')
			{
				if (_.isPhoneDevice() && this.selectedMenu === 'home')
				{
					// show side nav hide content
					this.$('.myaccount-layout-side-nav').removeClass('hide');
					this.$('.myaccount-layout-main').hide();
				}
				else if (!_.isPhoneDevice())
				{
					// show side nav and content
					this.$('.myaccount-layout-side-nav').removeClass('hide');
					this.$('.myaccount-layout-main').show();
				}
				else
				{
					// hide side nav show content
					this.$('.myaccount-layout-side-nav').addClass('hide');
					this.$('.myaccount-layout-main').show();
				}
			}
		}
		//@method showContent Extends the original show content and adds support to update the sidebar and the breadcrumb
	,	showContent: function (view, dont_scroll)
		{
			var promise = ApplicationSkeletonLayout.prototype.showContent.call(this, view, dont_scroll)
			,	selected_menu = this.getSelectedMenu(view);

			MenuTreeView.getInstance().updateSidebar(selected_menu);

			this.updateLayoutSB(selected_menu);

			return promise;
		}
	,	getSelectedMenu: function(view)
		{
			var menuTree = MenuTreeView.getInstance();
			var selected_menu = '';
			if (view.getSelectedMenu)
			{
				selected_menu = view.getSelectedMenu();
			}
			else
			{
				selected_menu = menuTree.getIdByUrl(Backbone.history.fragment);
			}
			return selected_menu;
		}
		//@property {Array} breadcrumbPrefix
	,	breadcrumbPrefix: [
				{
					href: '#'
				,	'data-touchpoint': 'home'
				,	'data-hashtag': '#'
				,	text: _('Home').translate()
				}
			,	{
					href: '#'
				,	'data-touchpoint': 'customercenter'
				,	'data-hashtag': '#overview'
				,	text: _('My Account').translate()
				}
		]

		//@propery {Object} childViews
	,	childViews: _.extend(ApplicationSkeletonLayout.prototype.childViews, {
			'MenuTree': function ()
			{
				this.menuTreeViewInstance = MenuTreeView.getInstance();
				this.menuTreeViewInstance.addChildViewInstances(this.menuTreeViewInstance.childViews, true);
				return this.menuTreeViewInstance;
			}
		})

	});
});