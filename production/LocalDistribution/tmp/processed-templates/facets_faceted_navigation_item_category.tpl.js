define('facets_faceted_navigation_item_category.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"facets-faceted-navigation-item-category\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isUncollapsible") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n	<div class=\"facets-faceted-navigation-item-category-facet-group\" data-type=\"rendered-facet\" data-facet-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"facetId") || (depth0 != null ? compilerNameLookup(depth0,"facetId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"facetId","hash":{},"data":data}) : helper)))
    + "\"  id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"htmlId") || (depth0 != null ? compilerNameLookup(depth0,"htmlId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"htmlId","hash":{},"data":data}) : helper)))
    + "\">\n\n		<div class=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCollapsed") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + " facets-faceted-navigation-item-category-facet-group-wrapper\">\n			<div class=\"facets-faceted-navigation-item-category-facet-group-content\">\n				<ul class=\"facets-faceted-navigation-item-category-facet-optionlist\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"displayValues") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</ul>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showExtraValues") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n			</div>\n		</div>\n	</div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<div class=\"facets-faceted-navigation-item-category-facet-group-expander\">\n			<h3 class=\"facets-faceted-navigation-item-category-title\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"parentName") || (depth0 != null ? compilerNameLookup(depth0,"parentName") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"parentName","hash":{},"data":data}) : helper)))
    + "</h3>\n		</div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<a href=\"#\" class=\"facets-faceted-navigation-item-category-facet-group-expander\" data-toggle=\"collapse\" data-target=\"#"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"htmlId") || (depth0 != null ? compilerNameLookup(depth0,"htmlId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"htmlId","hash":{},"data":data}) : helper)))
    + " .facets-faceted-navigation-item-category-facet-group-wrapper\" data-type=\"collapse\" title=\""
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Category",{"name":"translate","hash":{},"data":data}))
    + "\">\n			<i class=\"facets-faceted-navigation-item-category-facet-group-expander-icon\"></i>\n			<h3 class=\"facets-faceted-navigation-item-category-title\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"parentName") || (depth0 != null ? compilerNameLookup(depth0,"parentName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"parentName","hash":{},"data":data}) : helper)))
    + "</h3>\n		</a>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return " collapse ";
},"8":function(container,depth0,helpers,partials,data) {
    return " collapse in ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "						<li>\n							<a class=\"facets-faceted-navigation-item-category-facet-option "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"link") || (depth0 != null ? compilerNameLookup(depth0,"link") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"link","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\">\n								"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"displayName") || (depth0 != null ? compilerNameLookup(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper)))
    + "\n							</a>\n						</li>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "option-active";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "					<ul class=\"facets-faceted-navigation-item-category-facet-optionlist-extra collapse\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"extraValues") : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "					</ul>\n\n					<div class=\"facets-faceted-navigation-item-category-optionlist-extra-wrapper\">\n						<button class=\"facets-faceted-navigation-item-category-optionlist-extra-button\" data-toggle=\"collapse\" data-target=\"#"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"htmlId") || (depth0 != null ? compilerNameLookup(depth0,"htmlId") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"htmlId","hash":{},"data":data}) : helper)))
    + " .facets-faceted-navigation-item-category-facet-optionlist-extra\" data-action=\"see-more\">\n							<span data-type=\"see-more\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"See More",{"name":"translate","hash":{},"data":data}))
    + "\n							</span>\n							<span data-type=\"see-less\" class=\"facets-faceted-navigation-item-category-alt-caption\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"See Less",{"name":"translate","hash":{},"data":data}))
    + "\n							</span>\n						</button>\n					</div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "							<li>\n								<a class=\"facets-faceted-navigation-item-category-facet-option "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isActive") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"link") || (depth0 != null ? compilerNameLookup(depth0,"link") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"link","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"label") || (depth0 != null ? compilerNameLookup(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\">\n									"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"displayName") || (depth0 != null ? compilerNameLookup(depth0,"displayName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper)))
    + "\n								</a>\n							</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showFacet") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'facets_faceted_navigation_item_category'; return template;});