define('order_wizard_msr_package_creation_edit_quantity.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<p>\n	<span class=\"order-wizard-msr-package-creation-edit-quantity-label\">\n		"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Quantity:",{"name":"translate","hash":{},"data":data}))
    + "\n	</span>\n	<span class=\"order-wizard-msr-package-creation-edit-quantity-value\">\n		"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalQuantity") || (depth0 != null ? compilerNameLookup(depth0,"totalQuantity") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"totalQuantity","hash":{},"data":data}) : helper)))
    + "\n	</span>\n	</p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "	<span class=\"order-wizard-msr-package-creation-edit-quantity-label\">\n		"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Quantity:",{"name":"translate","hash":{},"data":data}))
    + "\n	</span>\n\n	<div class=\"order-wizard-msr-package-creation-edit-quantity-editable\" data-validation=\"control\">\n		<button class=\"order-wizard-msr-package-creation-edit-quantity-input-remove\" data-action=\"sub-quantity\">-</button>\n		<input type=\"number\" name=\"quantity\" data-item-id=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"itemId") || (depth0 != null ? compilerNameLookup(depth0,"itemId") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" id=\"quantity-"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"itemId") || (depth0 != null ? compilerNameLookup(depth0,"itemId") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"itemId","hash":{},"data":data}) : helper)))
    + "\" data-action=\"split-quantity\" class=\"order-wizard-msr-package-creation-edit-quantity-item-editable-quantity-normal\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"selectedQuantity") || (depth0 != null ? compilerNameLookup(depth0,"selectedQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"selectedQuantity","hash":{},"data":data}) : helper)))
    + "\" min=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"minQuantity") || (depth0 != null ? compilerNameLookup(depth0,"minQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"minQuantity","hash":{},"data":data}) : helper)))
    + "\" max=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalQuantity") || (depth0 != null ? compilerNameLookup(depth0,"totalQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"totalQuantity","hash":{},"data":data}) : helper)))
    + "\">\n		<button class=\"order-wizard-msr-package-creation-edit-quantity-input-add\" data-action=\"add-quantity\">+</button>\n	</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "	<small class=\"order-wizard-msr-package-creation-edit-quantity-quantity-help\">\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"(Minimum of $(0) required)",(depth0 != null ? compilerNameLookup(depth0,"minQuantity") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n	</small>\n	<p class=\"order-wizard-msr-package-creation-edit-quantity-error-message\" data-validation=\"error-placeholder\"></p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"order-wizard-msr-package-creation-edit-quantity-column\" data-validation=\"control-group\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isReadOnly") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showMinimumQuantity") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_msr_package_creation_edit_quantity'; return template;});