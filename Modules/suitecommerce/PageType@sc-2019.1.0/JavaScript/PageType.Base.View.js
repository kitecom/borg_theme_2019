/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module PageType
define(
	'PageType.Base.View'
,	[
		'Backbone.View'
	,	'jQuery'
	]
,	function (
		BackboneView
	,	jQuery
	)
{
	'use strict';

	//@class PageType.Base.View @extends Backbone.View
	//Base PageType class from where all the PageType Views extend from
	return { 'PageTypeBaseView': BackboneView.extend({


			constructor: function initialize(options)
			{
				//adapt to a acceptable format for extensibility layer
				options.pageInfo = {
					name: options.pageInfo.get('name'),
					url: options.pageInfo.get('urlPath'),
					header: options.pageInfo.get('page_header'),
					title: options.pageInfo.get('page_title'),
					fields: options.pageInfo.get('fields')
				};
				BackboneView.apply(this, arguments);
				//this method is needed by core to render proper breadcrumb, it should not be overwritten
				this.getBreadcrumbPages = function getBreadcrumbPages()
				{
					var pageInfo = options.pageInfo
						,	url = pageInfo.url
						,	path = url[0] === '/' ? url : '/' + url;

					return [{ href: path, text: pageInfo.title || pageInfo.header}];
				}
			}
			// @method beforeShowContent
			// The method 'showContent' will be executed only after the returned promise is resolved
			// @return {jQuery.Deferred}
		,	beforeShowContent: function beforeShowContent()
			{
				return jQuery.Deferred().resolve();
			}
		})
	}
});
