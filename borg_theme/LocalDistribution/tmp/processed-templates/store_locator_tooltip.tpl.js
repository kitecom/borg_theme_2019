define('store_locator_tooltip.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "					<span class=\"store-locator-tooltip-box-distance\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeDistance") || (depth0 != null ? compilerNameLookup(depth0,"storeDistance") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeDistance","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"distanceUnit") || (depth0 != null ? compilerNameLookup(depth0,"distanceUnit") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distanceUnit","hash":{},"data":data}) : helper)))
    + " </span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "					<span class=\"store-locator-tooltip-box-address\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"storeAddress") || (depth0 != null ? compilerNameLookup(depth0,"storeAddress") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"storeAddress","hash":{},"data":data}) : helper)))
    + " </span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"store-locator-tooltip-box\">\n	<a href=\"stores/details/"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeId") || (depth0 != null ? compilerNameLookup(depth0,"storeId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeId","hash":{},"data":data}) : helper)))
    + "\">\n		<span class=\"store-locator-tooltip-box-count\">\n			<span>"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (depth0 != null ? compilerNameLookup(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "</span>\n		</span>\n		<ul class=\"store-locator-tooltip-box-info\">\n			<li class=\"store-locator-tooltip-store-name\"><strong>"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeName") || (depth0 != null ? compilerNameLookup(depth0,"storeName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeName","hash":{},"data":data}) : helper)))
    + "</strong></li>\n			<li class=\"store-locator-tooltip-box-details\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showStoreDistance") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showStoreAddress") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</li>\n		</ul>\n		<a href=\"stores/details/"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeId") || (depth0 != null ? compilerNameLookup(depth0,"storeId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeId","hash":{},"data":data}) : helper)))
    + "\" class=\"store-locator-tooltip-box-arrow-container\">\n			<i class=\"store-locator-tooltip-box-arrow-icon\"></i>\n		</a>\n	</a>\n</li>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'store_locator_tooltip'; return template;});