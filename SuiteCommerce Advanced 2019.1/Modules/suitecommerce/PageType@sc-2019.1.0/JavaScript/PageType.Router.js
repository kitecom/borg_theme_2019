/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Home
define(
	'PageType.Router'
,	[
		'Backbone'
	]
,	function (
		Backbone
	)
{
	'use strict';

	// @lass Home.Router @extends Backbone.Router
	return Backbone.Router.extend({

		initialize: function (application)
		{
			this.application = application;
		}
	});
});
