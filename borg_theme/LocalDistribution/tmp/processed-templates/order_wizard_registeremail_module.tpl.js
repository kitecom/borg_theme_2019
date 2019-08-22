define('order_wizard_registeremail_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return " checked ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"order-wizard-registeremail-module\">\n	<div class=\"order-wizard-registeremail-module-show-addresses-container\">\n		<h3 class=\"order-wizard-registeremail-module-title\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Enter Email Address",{"name":"translate","hash":{},"data":data}))
    + "\n		</h3>\n		<div class=\"order-wizard-registeremail-module-form-placeholder\">\n			<label class=\"order-wizard-registeremail-module-edit-fields-group-label\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Email Address",{"name":"translate","hash":{},"data":data}))
    + "\n				<span class=\"order-wizard-registeremail-module-input-required\">*</span>\n			</label>\n\n			<input type=\"email\" name=\"email\" id=\"email\" class=\"order-wizard-registeremail-module-edit-fields-group-input\" placeholder=\""
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"your@email.com",{"name":"translate","hash":{},"data":data}))
    + "\" value=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"email") || (depth0 != null ? compilerNameLookup(depth0,"email") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"email","hash":{},"data":data}) : helper)))
    + "\" >\n			<small class=\"order-wizard-registeremail-module-input-help\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"We need you email address to send you information about your order.",{"name":"translate","hash":{},"data":data}))
    + "\n			</small>\n		</div>\n		<label class=\"order-wizard-registeremail-module-checkbox\">\n			<input\n				type=\"checkbox\"\n				name=\"sign-up-newsletter\"\n				"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isEmailSubcribe") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n			>\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Sign up for our Newsletter to receive promotions",{"name":"translate","hash":{},"data":data}))
    + "\n		</label>\n	</div>\n</div>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_registeremail_module'; return template;});