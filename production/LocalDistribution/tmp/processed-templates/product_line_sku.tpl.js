define('product_line_sku.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"product-line-sku-container\">\n	<span class=\"product-line-sku-label\">\n		"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"SKU:",{"name":"translate","hash":{},"data":data}))
    + "\n	</span>\n	<span class=\"product-line-sku-value\" itemprop=\"sku\">\n		"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"sku") || (depth0 != null ? compilerNameLookup(depth0,"sku") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"sku","hash":{},"data":data}) : helper)))
    + "\n	</span>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_line_sku'; return template;});