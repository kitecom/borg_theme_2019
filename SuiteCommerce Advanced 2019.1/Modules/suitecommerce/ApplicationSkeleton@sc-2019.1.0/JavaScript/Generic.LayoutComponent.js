/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*jshint unused:false*/

// @module ApplicationSkeleton
define(
	'Generic.LayoutComponent'
,	[
		'SC.LayoutComponent'
	]
,	function(
		SCLayoutComponent
	)
{
	'use strict';

	return SCLayoutComponent;
});


// @class View
// A view is a visual unit which responsibility is to show a model instance in the DOM, event binding, view composition, etc.
// IN SuiteCommerce, Views are implemented with [Backbonejs Backbone.View](http://backbonejs.org/#View). *View* here is just
// a name to hide implementation specific details.
// The applicaiotn's layout have a *currentView* that implements a main feature and usually correspond to a stateless url.
// @extlayer

// @class Backbone.View SuiteCommerce BackboneViews implement a View so if your extension implements a Backbone.View you can pass
// such an instance to, for example, @?method setCurrentView @extends View. See [Backbonejs Backbone.View](http://backbonejs.org/#View)
// @extlayer
