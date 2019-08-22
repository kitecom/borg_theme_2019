/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module SC
define('SC.BaseComponent.ChildViewsComponent'
,	[
		'underscore'
	]
,	function (
		_
	)
{
	'use strict';

	var root_component_map = {};

	// window.component = root_component_map;

	return {

		_normalizeChildViews: function _normalizeChildViews(child_views)
		{
			_.each(child_views, function(view_name, container_name)
			{
				if (_.isFunction(view_name))
				{
					var childViewConstructor = view_name;

					child_views[container_name] = {};

					child_views[container_name][container_name] =	{
						childViewIndex: 10
					,	childViewIsExternal: true
					,	childViewConstructor: childViewConstructor
				   };
				}
				else
				{
					_.each(view_name, function(child_view)
					{
						child_view.childViewIsExternal = true;
					});
				}
			});

			return child_views;
		}

	,	addChildViews: function addChildViews (component_id, child_views)
		{
			var self = this;

			child_views = this._normalizeChildViews(child_views || {});

			_.each(child_views, function(views, data_view)
			{
				self._createChildViewContainer(component_id, data_view);

				_.each(views, function(generator, view_id)
				{

					root_component_map[component_id][data_view].push((function(data_view, child_view_id, generator)
					{
						return function()
						{
							var childView = {};
							childView[data_view] = {};
							childView[data_view][child_view_id] = generator;

							this.addChildViewInstances(childView, false);
						};
					}(data_view, view_id, generator)));
				});
			});
		}

	,	removeChildView: function removeChildView (component_id, container_name, view_name)
		{
			this._createChildViewContainer(component_id, container_name);

			root_component_map[component_id][container_name].push((function(data_view, child_view_id)
			{
				return function()
				{
					this.removeChildViewInstance(data_view, child_view_id, true);
				};

			}(container_name, view_name)));
		}

	,	setChildViewIndex: function setChildViewIndex(component_id, container_name, view_name, index)
		{
			this._createChildViewContainer(component_id, container_name);

			root_component_map[component_id][container_name].push((function(data_view, child_view_id, child_view_index)
			{
				return function()
				{
					this.setChildViewIndex(data_view, child_view_id, child_view_index, false)
				};
			}(container_name, view_name, index)));
		}

	,	_createChildViewContainer: function _createChildViewContainer(component_id, container_name, view_name)
		{
			root_component_map[component_id] = root_component_map[component_id] || {};
			root_component_map[component_id][container_name] = root_component_map[component_id][container_name] || [];
		}

	,	getModifiedChildViews: function getModifiedChildViews (component_id, data_views)
		{
			if (root_component_map[component_id])
			{
				return _.pick(root_component_map[component_id], data_views);
			}

			return {};
		}
	};
});
