define('order_wizard_paymentmethod_paypal_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "\n            <p>\n                "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"You have <b>selected to pay using PayPal</b> as your payment method.",{"name":"translate","hash":{},"data":data}))
    + "\n            </p>\n            <p>\n                "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"To <b>review</b> your order, click the <b>\"Continue\" button</b> below.",{"name":"translate","hash":{},"data":data}))
    + "\n            </p>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "            <p>\n                "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Please select the <b>\"Continue To PayPal\" button</b> below to <b>sign in into your PayPal</b> account.",{"name":"translate","hash":{},"data":data}))
    + "\n            </p>\n            <p>\n                "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"You will be <b>redirected to PayPal</b>, but <b>will have an opportunity to review</b> your order back on our site before purchasing.",{"name":"translate","hash":{},"data":data}))
    + "\n            </p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"order-wizard-paymentmethod-paypal-module-row\">\n\n	<a class=\"order-wizard-paymentmethod-paypal-module-container order-wizard-paymentmethod-paypal-module-container-selected\">\n		<input type=\"radio\" name=\"paymentmethod-paypal-option\" class=\"order-wizard-paymentmethod-paypal-module-radio\" data-id=\"paypal\" value=\"paypal\" checked>\n			<b>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Selected",{"name":"translate","hash":{},"data":data}))
    + "</b>\n	</a>\n	<div class=\"order-wizard-paymentmethod-paypal-module-details order-wizard-paymentmethod-paypal-module-container-selected\">\n		<div class=\"order-wizard-paymentmethod-paypal-module-details-container\">\n			<img class=\"order-wizard-paymentmethod-paypal-module-paypal-logo\" src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault") || (depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault")) || alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"paypalImageUrl") : depth0),"img/paypal.png",{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data}))
    + "\" alt=\"PayPal\">\n		</div>\n	</div>\n</div>\n\n\n<div class=\"order-wizard-paymentmethod-paypal-module-description\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isPaypalComplete") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_paymentmethod_paypal_module'; return template;});