define('store_locator_list.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li class=\"store-locator-list-box\" data-id="
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeId") || (depth0 != null ? compilerNameLookup(depth0,"storeId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeId","hash":{},"data":data}) : helper)))
    + ">\n	<a href=\"stores/details/"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeId") || (depth0 != null ? compilerNameLookup(depth0,"storeId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeId","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"show-in-pusher\">\n		<div class=\"store-locator-list-box-count\">\n			<div>"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (depth0 != null ? compilerNameLookup(depth0,"index") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "</div>\n		</div>\n		<ul class=\"store-locator-list-box-info\">\n			<li>\n				<strong class=\"store-locator-list-box-info-name\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeName") || (depth0 != null ? compilerNameLookup(depth0,"storeName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeName","hash":{},"data":data}) : helper)))
    + "</strong>\n			</li>\n			<li class=\"store-locator-list-box-details\">\n			<div class=\"store-locator-list-box-distance\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeDistance") || (depth0 != null ? compilerNameLookup(depth0,"storeDistance") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeDistance","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"distanceUnit") || (depth0 != null ? compilerNameLookup(depth0,"distanceUnit") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distanceUnit","hash":{},"data":data}) : helper)))
    + "</div>\n			<div class=\"store-locator-list-box-address\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"storeAddress") || (depth0 != null ? compilerNameLookup(depth0,"storeAddress") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storeAddress","hash":{},"data":data}) : helper)))
    + "</div>\n			</li>\n		</ul>\n		<span class=\"store-locator-list-box-arrow-container\">\n			<i class=\"store-locator-list-box-arrow-icon\"></i>\n		</span>\n	</a>\n</li>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'store_locator_list'; return template;});