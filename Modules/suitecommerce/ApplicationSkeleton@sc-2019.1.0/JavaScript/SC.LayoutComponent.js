/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/*jshint unused:false*/

// @module ApplicationSkeleton
define(
	'SC.LayoutComponent'
,	[
		'SC.VisualComponent'
	,	'underscore'
	,	'jQuery'
	]
,	function(
		SCVisualComponent
	,	_
	,	jQuery
	)
{
	'use strict';

	// @class LayoutComponent Allow users to manipulate views composition, bindings, events, template context, current view, exposing
	// interesting moments as events regarding navigation and application life cycle.
	// @extends SC.BaseComponent @public @extlayer

	return function LayoutComponentGenerator (application)
	{

		var privateComponent = SCVisualComponent.extend({

			componentName: 'Layout'

		,	application: application

		,	ALL_VIEWS: 'Backbone.View'

		,	DEFAULT_VIEW: 'Backbone.View'

		,	_isViewFromComponent: function _isViewFromComponent ()
			{
				return true;
			}

		,	_getViewIdentifier: function _getViewIdentifier (view)
			{
				return view && view.attributes && view.attributes.id;
			}

			// @method addChildView Add a child view in the data-view 'data_view' passed as parameter in the default view of the component
		,	addChildView: function addChildView(data_view, view_constructor)
			{
				var generator = {}
				,	view_id = _.uniqueId('view');

				generator[data_view] = {};
				generator[data_view][view_id] = {
					childViewConstructor: view_constructor
				};

				this.addChildViews(this.ALL_VIEWS, generator);

				return view_id;
			}

		,	showContent: function showContent(view, options)
			{
				try
				{
					if (view)
					{
						options = options || {};

						if (options.showInModal)
						{
							return this.application.getLayout().showInModal(view, options.options);
						}
						else
						{
							return this.application.getLayout().showContent(view, options.dontScroll);
						}
					}
					else
					{
						this._reportError('INVALID_PARAM', 'Missing "view" parameter');
					}

				}
				catch (error)
				{
					return jQuery.Deferred().reject(error);
				}
			}

		});

		return privateComponent;
	};
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
