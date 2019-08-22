define('return_authorization_form_item_summary.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	<label class=\"return-authorization-form-item-summary-quantity-label\">"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Quantity to return:",{"name":"translate","hash":{},"data":data}))
    + "</label>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isQuantityGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<input class=\"return-authorization-form-item-summary-quantity-field\" data-action=\"quantity\" type=\"number\" name=\"quantity\" data-toggle=\"false\" value=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"selectedQuantity") || (depth0 != null ? compilerNameLookup(depth0,"selectedQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selectedQuantity","hash":{},"data":data}) : helper)))
    + "\" min=\"1\" max=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"maxQuantity") || (depth0 != null ? compilerNameLookup(depth0,"maxQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"maxQuantity","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"of $(0)",(depth0 != null ? compilerNameLookup(depth0,"maxQuantity") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n		<p><small class=\"return-authorization-form-item-summary-edit-text\">"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Edit quantity to return",{"name":"translate","hash":{},"data":data}))
    + "</small></p>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<label class=\"return-authorization-form-item-summary-quantity-label\">\n			<br>\n			"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"maxQuantity") || (depth0 != null ? compilerNameLookup(depth0,"maxQuantity") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"maxQuantity","hash":{},"data":data}) : helper)))
    + "\n		</label>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	<label class=\"return-authorization-form-item-summary-quantity-label\">\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Quantity to return:",{"name":"translate","hash":{},"data":data}))
    + " <br>\n		<b>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isQuantityGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "		</b>\n	</label>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"$(0) of $(0)",(depth0 != null ? compilerNameLookup(depth0,"maxQuantity") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "			"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"maxQuantity") || (depth0 != null ? compilerNameLookup(depth0,"maxQuantity") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"maxQuantity","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isLineActive") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'return_authorization_form_item_summary'; return template;});