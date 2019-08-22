define('product_views_price.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isPriceRange") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<span class=\"product-views-price-range\" itemprop=\"offers\" itemscope itemtype=\"https://schema.org/AggregateOffer\">\n				<meta itemprop=\"priceCurrency\" content=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"currencyCode") || (depth0 != null ? compilerNameLookup(depth0,"currencyCode") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"currencyCode","hash":{},"data":data}) : helper)))
    + "\"/>\n				<!-- Price Range -->\n				<span class=\"product-views-price-lead\" data-role=\"product-view-price-lead\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<span itemprop=\"lowPrice\" data-rate=\"$(0)\" >$(1)</span> - <span itemprop=\"highPrice\" data-rate=\"$(2)\">$(3)</span>",(depth0 != null ? compilerNameLookup(depth0,"minPrice") : depth0),(depth0 != null ? compilerNameLookup(depth0,"minPriceFormatted") : depth0),(depth0 != null ? compilerNameLookup(depth0,"maxPrice") : depth0),(depth0 != null ? compilerNameLookup(depth0,"maxPriceFormatted") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n				</span>\n				<!--"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showComparePrice") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n				<link itemprop=\"availability\" href=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isInStock") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\"/>\n			</span>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "-->\n					<small class=\"product-views-price-old\">\n						"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"comparePriceFormatted") || (depth0 != null ? compilerNameLookup(depth0,"comparePriceFormatted") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"comparePriceFormatted","hash":{},"data":data}) : helper)))
    + " \n					</small>\n				<!--";
},"5":function(container,depth0,helpers,partials,data) {
    return "https://schema.org/InStock";
},"7":function(container,depth0,helpers,partials,data) {
    return "https://schema.org/OutOfStock";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "			<span class=\"product-views-price-exact\" itemprop=\"offers\" itemscope itemtype=\"https://schema.org/Offer\">\n				<meta itemprop=\"priceCurrency\" content=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"currencyCode") || (depth0 != null ? compilerNameLookup(depth0,"currencyCode") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"currencyCode","hash":{},"data":data}) : helper)))
    + "\"/>\n				<!-- Single -->\n				<span class=\"product-views-price-lead\" itemprop=\"price\" data-rate=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"price") || (depth0 != null ? compilerNameLookup(depth0,"price") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "\" data-role=\"price-lead-formatted\">\n					"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"priceFormatted") || (depth0 != null ? compilerNameLookup(depth0,"priceFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"priceFormatted","hash":{},"data":data}) : helper)))
    + "\n				</span>\n				<small class=\"product-views-price-old\">\n					"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel5_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel5_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel5_formatted","hash":{},"data":data}) : helper)))
    + "\n				</small>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showComparePrice") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				<link itemprop=\"availability\" href=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isInStock") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\"/>\n			</span>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n						"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"comparePriceFormatted") || (depth0 != null ? compilerNameLookup(depth0,"comparePriceFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"comparePriceFormatted","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel5_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel5_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel5_formatted","hash":{},"data":data}) : helper)))
    + " "
    + alias4(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"item") : depth0)) != null ? compilerNameLookup(stack1,"price_1_") : stack1), depth0))
    + "--> "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel1_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel1_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel1_formatted","hash":{},"data":data}) : helper)))
    + "\n					\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showHighlightedMessage") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"product-views-price-login-to-see-prices-highlighted\">\n				<p class=\"product-views-price-message\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Please <a href=\"$(0)\" data-navigation=\"ignore-click\">log in</a> to see price or purchase this item",(depth0 != null ? compilerNameLookup(depth0,"urlLogin") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n			</div>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"product-views-price-login-to-see-prices\">\n				<p class=\"product-views-price-message\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<a href=\"$(0)\" data-navigation=\"ignore-click\">Log in</a> to see price",(depth0 != null ? compilerNameLookup(depth0,"urlLogin") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n			</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"product-views-price\">\n	<div>"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel1_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel1_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel1_formatted","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel9_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel9_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel9_formatted","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"pricelevel5_formatted") || (depth0 != null ? compilerNameLookup(depth0,"pricelevel5_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pricelevel5_formatted","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"rate_formatted") || (depth0 != null ? compilerNameLookup(depth0,"rate_formatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rate_formatted","hash":{},"data":data}) : helper)))
    + "\n</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isPriceEnabled") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_views_price'; return template;});