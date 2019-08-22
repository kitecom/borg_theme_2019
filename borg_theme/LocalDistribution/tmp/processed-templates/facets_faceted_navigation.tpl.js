define('facets_faceted_navigation.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "	<div class=\"facets-faceted-navigation-facet-group\">\n		<div class=\"facets-faceted-navigation-title\">\n			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Shop: $(0)",(depth0 != null ? compilerNameLookup(depth0,"categoryItemId") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n		</div>\n		<div class=\"facets-faceted-navigation-category-wrapper\">\n			<div data-type=\"facet\" data-facet-id=\"category\"></div>\n		</div>\n	</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	<div class=\"facets-faceted-navigation-title-holder\">\n		<h3 class=\"facets-faceted-navigation-title\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Store Filter",{"name":"translate","hash":{},"data":data}))
    + "</h3>\n	</div>\n	<h4 class=\"facets-faceted-navigation-results\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "	</h4>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasAppliedFacets") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<div class=\"facets-faceted-navigation-item-facet-group-wrapper\">\n		<div id=\"cat-list\" class=\"facets-faceted-navigation-item-facet-group\">\n			<h4>Categories</h4>\n			<ul class=\"facets-faceted-navigation-item-facet-optionlist\">\n				<li>\n					<a id=\"cat-models\" class=\"facets-faceted-navigation-item-facet-option cats\" href=\"/models\">Models</a>\n				</li>\n				<li>\n					<a id=\"cat-accs\" class=\"facets-faceted-navigation-item-facet-option cats\" href=\"/accessories\">Accessories</a>\n				</li>\n				<li>\n					<a id=\"cat-parts\" class=\"facets-faceted-navigation-item-facet-option cats\" href=\"/parts\">Parts</a>\n				</li>\n			</ul>\n		</div>\n	</div>\n\n	<div data-view=\"Facets.FacetedNavigationItems\"></div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTotalProductsOne") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"1 Result for <span class=\"facets-faceted-navigation-title-alt\">$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) Results for <span class=\"facets-faceted-navigation-title-alt\">$(1)</span>",(depth0 != null ? compilerNameLookup(depth0,"totalProducts") : depth0),(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTotalProductsOne") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"1 Product",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) Products",(depth0 != null ? compilerNameLookup(depth0,"totalProducts") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<!--a href=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"clearAllFacetsLink") || (depth0 != null ? compilerNameLookup(depth0,"clearAllFacetsLink") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"clearAllFacetsLink","hash":{},"data":data}) : helper)))
    + "\" class=\"facets-faceted-navigation-facets-clear\">\n			<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Clear All",{"name":"translate","hash":{},"data":data}))
    + "</span>\n			<i class=\"facets-faceted-navigation-facets-clear-icon\"></i>\n		</a-->\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasCategories") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasFacetsOrAppliedFacets") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<script type=\"text/javascript\" charset=\"utf-8\">\n   \n$(function() {\n  var loc = window.location.href; // returns the full URL\n  if(/models/.test(loc)) {\n    $('#cat-models').addClass('option-active');\n  }\n  if(/accessories/.test(loc)) {\n    $('#cat-accs').addClass('option-active');\n  }\n  if(/parts/.test(loc)) {\n    $('#cat-parts').addClass('option-active');\n  }\n});\n\n</script>\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'facets_faceted_navigation'; return template;});