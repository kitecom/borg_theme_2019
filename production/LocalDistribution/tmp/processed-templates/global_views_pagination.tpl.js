define('global_views_pagination.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<nav class=\"global-views-pagination\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPageIndicator") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n	<ul class=\"global-views-pagination-links "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPaginationLinksCompactClass") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCurrentPageDifferentThan1") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPageList") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isCurrentPageLast") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.program(20, data, 0),"data":data})) != null ? stack1 : "")
    + "	</ul>\n</nav>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "	<p class=\"global-views-pagination-count\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) of $(1)",(depth0 != null ? compilerNameLookup(depth0,"currentPage") : depth0),(depth0 != null ? compilerNameLookup(depth0,"totalPages") : depth0),{"name":"translate","hash":{},"data":data}))
    + "</p>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " global-views-pagination-links-compact ";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<li class=\"global-views-pagination-prev\">\n			<a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"previousPageURL") || (depth0 != null ? compilerNameLookup(depth0,"previousPageURL") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"previousPageURL","hash":{},"data":data}) : helper)))
    + "\">\n				<i class=\"global-views-pagination-prev-icon\"></i>\n			</a>\n		</li>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<li class=\"global-views-pagination-prev-disabled\">\n			<a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"currentPageURL") || (depth0 != null ? compilerNameLookup(depth0,"currentPageURL") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"currentPageURL","hash":{},"data":data}) : helper)))
    + "\">\n				<i class=\"global-views-pagination-prev-icon\"></i>\n			</a>\n		</li>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isRangeStartGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"pages") : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isRangeEndLowerThanTotalPages") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<li class=\"global-views-pagination-disabled\">\n			<a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"currentPageURL") || (depth0 != null ? compilerNameLookup(depth0,"currentPageURL") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"currentPageURL","hash":{},"data":data}) : helper)))
    + "\">...</a>\n		</li>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isCurrentPageActivePage") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<li class=\"global-views-pagination-links-number\">\n			<a class=\"global-views-pagination-active\" href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"fixedURL") || (depth0 != null ? compilerNameLookup(depth0,"fixedURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fixedURL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pageIndex") || (depth0 != null ? compilerNameLookup(depth0,"pageIndex") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pageIndex","hash":{},"data":data}) : helper)))
    + "</a>\n		</li>\n";
},"16":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<li class=\"global-views-pagination-links-number\">\n			<a href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"URL") || (depth0 != null ? compilerNameLookup(depth0,"URL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"URL","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pageIndex") || (depth0 != null ? compilerNameLookup(depth0,"pageIndex") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pageIndex","hash":{},"data":data}) : helper)))
    + "</a>\n		</li>\n";
},"18":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<li class=\"global-views-pagination-next-disabled\">\n			<a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"currentPageURL") || (depth0 != null ? compilerNameLookup(depth0,"currentPageURL") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"currentPageURL","hash":{},"data":data}) : helper)))
    + "\">\n				<i class=\"global-views-pagination-next-icon\"></i>\n			</a>\n		</li>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<li class=\"global-views-pagination-next\">\n			<a href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"nextPageURL") || (depth0 != null ? compilerNameLookup(depth0,"nextPageURL") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"nextPageURL","hash":{},"data":data}) : helper)))
    + "\">\n				<i class=\"global-views-pagination-next-icon\"></i>\n			</a>\n		</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"currentPageLowerThanTotalPagesAndCurrentPageGreaterThan0AndPagesCountGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'global_views_pagination'; return template;});