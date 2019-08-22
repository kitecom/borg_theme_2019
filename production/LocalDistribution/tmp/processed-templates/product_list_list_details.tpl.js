define('product_list_list_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"internalId","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "tmpl_"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"templateId") || (depth0 != null ? compilerNameLookup(depth0,"templateId") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"templateId","hash":{},"data":data}) : helper)));
},"5":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"listName") : depth0),{"name":"translate","hash":{},"data":data}));
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"listName") || (depth0 != null ? compilerNameLookup(depth0,"listName") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"listName","hash":{},"data":data}) : helper)));
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "				<span class=\"product-list-list-details-item-count\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"itemsLength") || (depth0 != null ? compilerNameLookup(depth0,"itemsLength") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"itemsLength","hash":{},"data":data}) : helper)))
    + "</span>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasOneItem") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasLastItem") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"product",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"products",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "					("
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"last added",{"name":"translate","hash":{},"data":data}))
    + " <a class=\"product-list-list-details-last-item\" "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"lastProductItemUrl") || (depth0 != null ? compilerNameLookup(depth0,"lastProductItemUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lastProductItemUrl","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"lastItemDisplayName") || (depth0 != null ? compilerNameLookup(depth0,"lastItemDisplayName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lastItemDisplayName","hash":{},"data":data}) : helper)))
    + "</a>)\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "				<span> "
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"No items yet",{"name":"translate","hash":{},"data":data}))
    + "</span>\n";
},"18":function(container,depth0,helpers,partials,data) {
    return "			<p class=\"product-list-list-details-stock\">\n				<span class=\"product-list-list-details-not-purchasable-message\">\n					<i class=\"product-list-list-details-not-purchasable-message-icon\"></i>\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Some products from this list are not available for purchase",{"name":"translate","hash":{},"data":data}))
    + "\n				</span>\n			</p>\n";
},"20":function(container,depth0,helpers,partials,data) {
    return "			<p class=\"product-list-list-details-minquantity\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"The quantity of some of the items needs to be updated to match the minimum required to purchase. Go to <a href=\"/wishlist/$(0)\">$(1)</a>",(depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0),(depth0 != null ? compilerNameLookup(depth0,"listName") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n			</p>\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "			<p class=\"product-list-list-details-description\">\n			<span class=\"product-list-list-details-description-label\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Notes: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n			<span class=\"product-list-list-details-description-value\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTypePredefined") : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.program(25, data, 0),"data":data})) != null ? stack1 : "")
    + "			</span>\n			</p>\n";
},"23":function(container,depth0,helpers,partials,data) {
    return "						"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"listDescription") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"25":function(container,depth0,helpers,partials,data) {
    var helper;

  return "						"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"listDescription") || (depth0 != null ? compilerNameLookup(depth0,"listDescription") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"listDescription","hash":{},"data":data}) : helper)))
    + "\n";
},"27":function(container,depth0,helpers,partials,data) {
    return "disabled";
},"29":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<div class=\"product-list-list-details-button-group\">\n				<button class=\"product-list-list-details-button-edit\" data-action=\"edit-list\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Edit List",{"name":"translate","hash":{},"data":data}))
    + "</button>\n				<button class=\"product-list-list-details-button-expander\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n					<i></i>\n				</button>\n				<ul class=\"product-list-list-details-dropdown\" role=\"menu\">\n					<li>\n						<a href=\"#\" data-action=\"delete-list\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Delete List",{"name":"translate","hash":{},"data":data}))
    + "</a>\n					</li>\n				</ul>\n			</div>\n";
},"31":function(container,depth0,helpers,partials,data) {
    return "			<button class=\"product-list-list-details-share\" data-action=\"share-list\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Email/Share List",{"name":"translate","hash":{},"data":data}))
    + "</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<tr class=\"product-list-list-details-wrapper\" data-action=\"navigate\" data-product-list-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"internalId","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"internalId") || (depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"internalId","hash":{},"data":data}) : helper)))
    + "\">\n	<td class=\"product-list-list-details-main\">\n\n		<p class=\"product-list-list-details-text\">\n			<a class=\"product-list-list-details-anchor\" href=\"/wishlist/"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"internalId") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n				"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTypePredefined") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\n			</a>\n		</p>\n\n		<p>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasItems") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "		</p>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasOutOfStockItems") : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasMinimumQuantityItems") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</td>\n\n	<td class=\"product-list-list-details-info\">\n		<p class=\"product-list-list-details-last-update\">\n			<span class=\"product-list-list-details-last-update-label\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Last updated: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n			<span class=\"product-list-list-details-last-update-value\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"lastModifiedDate") || (depth0 != null ? compilerNameLookup(depth0,"lastModifiedDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastModifiedDate","hash":{},"data":data}) : helper)))
    + "</span>\n		</p>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasListDescription") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</td>\n\n	<td class=\"product-list-list-details-actions\">\n		<button data-action=\"add-to-cart\" class=\"product-list-list-details-add-to-cart\" "
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAvailableForCart") : depth0),{"name":"unless","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Add List to Cart",{"name":"translate","hash":{},"data":data}))
    + "</button>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTypePredefined") : depth0),{"name":"unless","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isListPrivate") : depth0),{"name":"unless","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</td>\n</tr>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_list_list_details'; return template;});