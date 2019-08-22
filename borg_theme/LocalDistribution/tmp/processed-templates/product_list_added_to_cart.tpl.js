define('product_list_added_to_cart.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<p class=\"product-list-added-to-cart-message\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"hasMoreThanOneModel") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "	</p>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span class=\"product-list-added-to-cart-list-from\">From: </span> <span class=\"product-list-added-to-cart-list-name\">$(0)</span> product list ($(1) items)",(depth0 != null ? compilerNameLookup(depth0,"listName") : depth0),(depth0 != null ? compilerNameLookup(depth0,"modelsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span class=\"product-list-added-to-cart-list-from\">From </span> <span class=\"product-list-added-to-cart-list-name\">$(0)</span> product list ($(1) item)",(depth0 != null ? compilerNameLookup(depth0,"listName") : depth0),(depth0 != null ? compilerNameLookup(depth0,"modelsLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"product-list-added-to-cart-modal-body\">\n	<span data-warning-message class=\"product-list-added-to-cart-warning-message\"></span>\n"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isItem") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<div class=\"product-list-added-to-cart-list\">\n		<table class=\"product-list-added-to-cart-table\">\n			<tbody data-view=\"ProductList.ItemsAddedToCart\"></tbody>\n		</table>\n	</div>\n</div>\n<div class=\"product-list-added-to-cart-modal-footer\">\n	<a class=\"product-list-added-to-cart-button-viewcart\" data-touchpoint=\"viewcart\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"View Cart &amp; Checkout",{"name":"translate","hash":{},"data":data}))
    + "</a>\n	<a class=\"product-list-added-to-cart-button-back\" data-dismiss=\"modal\" >"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Back to product list",{"name":"translate","hash":{},"data":data}))
    + "</a>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'product_list_added_to_cart'; return template;});