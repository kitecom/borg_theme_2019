define('order_wizard_paymentmethod_threedsecure_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n    <div class=\"alert alert-error\">\n\n        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"threeDSecureError") : depth0)) != null ? compilerNameLookup(stack1,"errorMessage") : stack1), depth0))
    + "\n\n    </div>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "\n        "
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"iframe") || (depth0 != null ? compilerNameLookup(depth0,"iframe") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"iframe","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"order-wizard-paymentmethod-threedsecure-module\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"threeDSecureError") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n</div>";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_paymentmethod_threedsecure_module'; return template;});