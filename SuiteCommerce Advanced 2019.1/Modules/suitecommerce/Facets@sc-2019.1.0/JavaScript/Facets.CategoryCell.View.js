/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Facets
define(
	'Facets.CategoryCell.View'
,	[
		'Categories.Utils'

	,	'facets_category_cell.tpl'

	,	'Backbone'
	]
,	function(
		CategoriesUtils

	,	facets_category_cell_tpl

	,	Backbone
	)
{
	'use strict';

	// @class Facets.CategoryCell.View @extends Backbone.View
	return Backbone.View.extend({

		template: facets_category_cell_tpl

		// @method getContext @return Facets.CategoryCell.View.Context
	,	getContext: function ()
		{
			var additionalFields = CategoriesUtils.getAdditionalFields(this.model.attributes, 'categories.subCategories.fields');

			return {
				// @property {String} label
				name: this.model.get('name')
				// @property {String} name
			,	url: this.model.get('fullurl')
				// @property {String} image
			,	image: this.model.get('thumbnailurl')
				// @property {Boolean} hasImage
			,	hasImage: !!this.model.get('thumbnailurl')
				// @property {Object} additionalFields
			,	additionalFields: additionalFields			};
		}
	});
});
