/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*

@module CMSadapter

@class CMSadapter.Impl.Merchandising
*/

define('CMSadapter.Impl.Merchandising'
,	[
		'underscore'
	,	'Backbone'
	,	'jQuery'
	]
,	function (
		_
	,	Backbone
	,	jQuery
	)
{
	'use strict';

	function AdapterMerchandising(application, CMS)
	{
		this.CMS = CMS;
		this.application = application;
		this.listenForCMS();
	}

	AdapterMerchandising.prototype.listenForCMS = jQuery.noop;

	return AdapterMerchandising;
});
