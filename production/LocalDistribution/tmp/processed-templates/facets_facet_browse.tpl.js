define('facets_facet_browse.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<div class=\"facets-facet-browse-content\">\n\n			<div class=\"facets-facet-browse-facets\" data-action=\"pushable\" data-id=\"product-search-facets\">\n				<h2 class=\"trade-store-title\">Trade Store</h2>\n				<h3 class=\"facets-faceted-navigation-store-title\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Store Filter",{"name":"translate","hash":{},"data":data}))
    + "</h3>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCategory") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n				<div data-view=\"Facets.FacetedNavigation\" data-exclude-facets=\"commercecategoryname,category\" class=\"facetWrapper\"></div>\n\n				<div data-cms-area=\"facet_navigation_bottom\" data-cms-area-filters=\"page_type\"></div>\n			</div>\n\n			<!--\n			Sample of how to add a particular facet into the HTML. It is important to specify the data-facet-id=\"<facet id>\"\n			properly <div data-view=\"Facets.FacetedNavigation.Item\" data-facet-id=\"custitem1\"></div>\n			 -->\n\n			<div class=\"facets-facet-browse-results\" itemscope=\"\" itemtype=\"https://schema.org/ItemList\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCategory") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n				<header class=\"facets-facet-browse-header\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showItems") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</header>\n\n				<meta itemprop=\"name\" content=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\"/>\n\n				<div data-cms-area=\"facets_facet_browse_cms_area_1\" data-cms-area-filters=\"page_type\"></div>\n\n				<div id=\"banner-section-top\" class=\"content-banner banner-section-top\" data-cms-area=\"item_list_banner_top\" data-cms-area-filters=\"path\"></div>\n\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showItems") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\n\n			<div class=\"facets-facet-browse-pagination\" data-view=\"GlobalViews.Pagination\"></div>\n		</div>\n\n		<div class=\"facets-facet-browse-cms-area-2\" data-cms-area=\"facets_facet_browse_cms_area_2\" data-cms-area-filters=\"page_type\"></div>\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "					<div data-view=\"Facets.CategorySidebar\" class=\"facets-facet-browse-facets-sidebar\"></div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "					<!--div class=\"facets-facet-browse-category\">\n						<div data-view=\"Facets.Browse.CategoryHeading\"></div>\n\n						<div data-view=\"Facets.CategoryCells\"></div>\n					</div-->\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "					<h1 class=\"facets-facet-browse-title\" data-quantity=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"total") || (depth0 != null ? compilerNameLookup(depth0,"total") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "					</h1>\n\n					<nav class=\"facets-facet-browse-list-header\">\n						<!--div class=\"facets-facet-browse-list-header-actions\" data-view=\"Facets.ItemListDisplaySelector\"></div-->\n\n						<div class=\"facets-facet-browse-list-header-expander\">\n							<button class=\"facets-facet-browse-list-header-expander-button collapsed\" data-toggle=\"collapse\" data-target=\"#list-header-filters\" aria-expanded=\"true\" aria-controls=\"list-header-filters\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Sort & Filter",{"name":"translate","hash":{},"data":data}))
    + "\n								<i class=\"facets-facet-browse-list-header-expander-icon\"></i>\n							</button>\n						</div>\n\n						<div class=\"facets-facet-browse-list-header-filters collapse\" id=\"list-header-filters\">\n							<div class=\"facets-facet-browse-list-header-filters-wrapper\">\n\n								<div class=\"facets-facet-browse-list-header-filters-row\">\n\n									<div class=\"facets-facet-browse-list-header-filter-column\" data-view=\"Facets.ItemListShowSelector\">\n									</div>\n\n									<div class=\"facets-facet-browse-list-header-filter-column\" data-view=\"Facets.ItemListSortSelector\">\n									</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasItemsAndFacets") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "								</div>\n\n							</div>\n						</div>\n					</nav>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTotalProductsOne") : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"1 Result for <span class=\"facets-facet-browse-title-alt\">$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) Results for <span class=\"facets-facet-browse-title-alt\">$(1)</span>",(depth0 != null ? compilerNameLookup(depth0,"total") : depth0),(depth0 != null ? compilerNameLookup(depth0,"keywords") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isTotalProductsOne") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"1 Product",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) Products",(depth0 != null ? compilerNameLookup(depth0,"total") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "										<div class=\"facets-facet-browse-list-header-filter-column\">\n											<button class=\"facets-facet-browse-list-header-filter-facets\" data-type=\"sc-pusher\" data-target=\"product-search-facets\">\n												"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Narrow By",{"name":"translate","hash":{},"data":data}))
    + "\n												<i class=\"facets-facet-browse-list-header-filter-facets-icon\"></i>\n											</button>\n										</div>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n						<div class=\"facets-facet-browse-narrowedby\" data-view=\"Facets.FacetsDisplay\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isEmptyList") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.program(22, data, 0),"data":data})) != null ? stack1 : "");
},"20":function(container,depth0,helpers,partials,data) {
    return "						<div class=\"noFacets\" data-view=\"Facets.Items.Empty\"></div>\n";
},"22":function(container,depth0,helpers,partials,data) {
    return "						<div class=\"facets-facet-browse-items\" data-view=\"Facets.Items\"></div>\n";
},"24":function(container,depth0,helpers,partials,data) {
    return "		<div class=\"facets-facet-browse-empty-items\" data-view=\"Facets.Items.Empty\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<section class=\"facets-facet-browse\">\n	<div data-cms-area=\"item_list_banner\" data-cms-area-filters=\"page_type\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showResults") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(24, data, 0),"data":data})) != null ? stack1 : "")
    + "\n	<div id=\"banner-section-bottom\" class=\"content-banner banner-section-bottom facets-facet-browse-banner-section-bottom\" data-cms-area=\"item_list_banner_bottom\" data-cms-area-filters=\"page_type\"></div>\n</section>\n\n<script type=\"text/javascript\">\n//  ;(function ($, window, document, undefined) {\n//     $('div.facets-facet-browse-narrowedby:empty').hide();\n// 	})\n// (jQuery, window, document);\n</script>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'facets_facet_browse'; return template;});