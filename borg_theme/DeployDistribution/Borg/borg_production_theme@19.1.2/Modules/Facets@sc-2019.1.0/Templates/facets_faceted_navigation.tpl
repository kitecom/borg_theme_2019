{{#if hasCategories}}
	<div class="facets-faceted-navigation-facet-group">
		<div class="facets-faceted-navigation-title">
			{{translate 'Shop: $(0)' categoryItemId}}
		</div>
		<div class="facets-faceted-navigation-category-wrapper">
			<div data-type="facet" data-facet-id="category"></div>
		</div>
	</div>
{{/if}}

{{#if hasFacetsOrAppliedFacets}}
	<div class="facets-faceted-navigation-title-holder">
		<h3 class="facets-faceted-navigation-title">{{translate 'Store Filter'}}</h3>
	</div>
	<h4 class="facets-faceted-navigation-results">
		{{#if keywords}}
			{{#if isTotalProductsOne}}
				{{translate '1 Result for <span class="facets-faceted-navigation-title-alt">$(0)</span>' keywords}}
			{{else}}
				{{translate '$(0) Results for <span class="facets-faceted-navigation-title-alt">$(1)</span>' totalProducts keywords}}
			{{/if}}
		{{else}}
			{{#if isTotalProductsOne}}
				{{translate '1 Product'}}
			{{else}}
				{{translate '$(0) Products' totalProducts}}
			{{/if}}
		{{/if}}
	</h4>

	{{#if hasAppliedFacets}}
		<!--a href="{{clearAllFacetsLink}}" class="facets-faceted-navigation-facets-clear">
			<span>{{translate 'Clear All'}}</span>
			<i class="facets-faceted-navigation-facets-clear-icon"></i>
		</a-->
	{{/if}}
	<div class="facets-faceted-navigation-item-facet-group-wrapper">
		<div id="cat-list" class="facets-faceted-navigation-item-facet-group">
			<h4>Categories</h4>
			<ul class="facets-faceted-navigation-item-facet-optionlist">
				<li>
					<a id="cat-models" class="facets-faceted-navigation-item-facet-option cats" href="/models">Models</a>
				</li>
				<li>
					<a id="cat-accs" class="facets-faceted-navigation-item-facet-option cats" href="/accessories">Accessories</a>
				</li>
				<li>
					<a id="cat-parts" class="facets-faceted-navigation-item-facet-option cats" href="/parts">Parts</a>
				</li>
			</ul>
		</div>
	</div>

	<div data-view="Facets.FacetedNavigationItems"></div>
{{/if}}

<script type="text/javascript" charset="utf-8">
   
$(function() {
  var loc = window.location.href; // returns the full URL
  if(/models/.test(loc)) {
    $('#cat-models').addClass('option-active');
  }
  if(/accessories/.test(loc)) {
    $('#cat-accs').addClass('option-active');
  }
  if(/parts/.test(loc)) {
    $('#cat-parts').addClass('option-active');
  }
});

</script>


{{!----
Use the following context variables when customizing this template:

	totalProducts (Number)
	isTotalProductsOne (Boolean)
	keywords (undefined)
	clearAllFacetsLink (String)
	hasCategories (Boolean)
	hasItems (Number)
	hasFacets (Number)
	hasCategoriesAndFacets (Boolean)
	appliedFacets (Array)
	hasAppliedFacets (Boolean)
	hasFacetsOrAppliedFacets (Number)

----}}
