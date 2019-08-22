/*
	© 2019 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

define('Facets.Browse.CategoryHeading.View'
,	[
		'Categories.Utils'

	,	'Backbone'
    ,	'facets_browse_category_heading.tpl'

	]
,	function (
		CategoriesUtils

	,	Backbone
	,	facetsBrowseCategoryHeadingTpl
	)
{
    'use strict';

    return Backbone.View.extend({

        template: facetsBrowseCategoryHeadingTpl

    ,	getContext: function ()
		{
			var additionalFields = CategoriesUtils.getAdditionalFields(this.model.attributes, 'categories.category.fields');

            return {
				// @property {String} name
                name: this.model.get('name')
				// @property {String} banner
            ,	banner: this.model.get('pagebannerurl')
				// @property {String} description
            ,	description: this.model.get('description')
				// @property {String} pageheading
			,	pageheading: this.model.get('pageheading') || this.model.get('name')
				// @property {Boolean} hasBanner
			,	hasBanner: !!this.model.get('pagebannerurl')
				// @property {Object} additionalFields
			,	additionalFields: additionalFields
				// @property {Boolean} showDescription
			,	showDescription: !!this.options.showDescription
            };
        }
    });
});
