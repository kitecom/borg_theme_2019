/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module PageType
define(
	'PageType'
,	[
		'PageType.Component'
	,	'PageType.Base.View'
	]
,	function (
		PageTypeComponent
	)
{
	'use strict';

	//@class PageType @extends ApplicationModule
	return {
		mountToApp: function (application)
		{
			return PageTypeComponent(application);
		}
	};
});
