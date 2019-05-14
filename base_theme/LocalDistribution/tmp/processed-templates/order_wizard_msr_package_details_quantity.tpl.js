define('order_wizard_msr_package_details_quantity.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "			<small class=\"muted order-wizard-msr-package-details-quantity-crossed\"> "
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"lineAmountFormatted") || (depth0 != null ? compilerNameLookup(depth0,"lineAmountFormatted") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"lineAmountFormatted","hash":{},"data":data}) : helper)))
    + " </small>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div class=\"order-wizard-msr-package-details-quantity\">\n	<p class=\"order-wizard-msr-package-details-quantity-count\">\n		<span class=\"order-wizard-msr-package-details-quantity-count-label\"> "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Quantity: ",{"name":"translate","hash":{},"data":data}))
    + " </span>\n		<span class=\"order-wizard-msr-package-details-quantity-count-value\" data-type=\"item-quantity\"> "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"lineQuantity") || (depth0 != null ? compilerNameLookup(depth0,"lineQuantity") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lineQuantity","hash":{},"data":data}) : helper)))
    + " </span>\n	</p>\n	<div class=\"order-wizard-msr-package-details-quantity-amount\">\n		<p class=\"order-wizard-msr-package-details-quantity-amount\">\n		<span class=\"order-wizard-msr-package-details-quantity-amount-label\"> "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n			<span class=\"order-wizard-msr-package-details-quantity-amount-value\" data-type=\"item-amount\"> "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"lineTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"lineTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lineTotalFormatted","hash":{},"data":data}) : helper)))
    + " </span>\n		</p>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAmountGreaterThanTotal") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_msr_package_details_quantity'; return template;});