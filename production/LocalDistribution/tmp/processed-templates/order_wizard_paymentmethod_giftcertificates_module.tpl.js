define('order_wizard_paymentmethod_giftcertificates_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		<header class=\"order-wizard-paymentmethod-giftcertificates-module-step-header\">\n			<h2 class=\"order-wizard-paymentmethod-giftcertificates-module-section-header\">\n				"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"pageHeader") || (depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pageHeader","hash":{},"data":data}) : helper)))
    + "\n			</h2>\n		</header>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Add other Gift Certificate",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Apply a Gift Certificate",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "		<table class=\"order-wizard-paymentmethod-giftcertificates-module-table\">\n			<thead class=\"order-wizard-paymentmethod-giftcertificates-module-table-header\">\n				<tr>\n					<th class=\"order-wizard-paymentmethod-giftcertificates-module-row-number\">\n						<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Gift Certificate number",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					</th>\n					<th class=\"order-wizard-paymentmethod-giftcertificates-module-row-amount\">\n						<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount applied",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					</th>\n					<th class=\"order-wizard-paymentmethod-giftcertificates-module-row-remaining\">\n						<span>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Remaining balance",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					</th>\n					<th class=\"order-wizard-paymentmethod-giftcertificates-module-row-actions\"></th>\n				</tr>\n			</thead>\n			<tbody class=\"order-wizard-paymentmethod-giftcertificates-module-table-body\" data-view=\"GiftCertificatesRecords\"></tbody>\n		</table>\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"order-wizard-paymentmethod-giftcertificates-module\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"pageHeader") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n	<div class=\"order-wizard-paymentmethod-giftcertificates-module-expander-head\">\n		<a class=\"order-wizard-paymentmethod-giftcertificates-module-expander-head-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#gift-certificate-form\" aria-expanded=\"false\" aria-controls=\"gift-certificate-form\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasGiftCertificates") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "			<i class=\"order-wizard-paymentmethod-giftcertificates-module-expander-icon\"></i>\n		</a>\n	</div>\n	<form id=\"gift-certificate-form\" class=\"order-wizard-paymentmethod-giftcertificates-module-form collapse\" data-action=\"gift-certificate-form\">\n		<div class=\"order-wizard-paymentmethod-giftcertificates-module-form-expander-container\">\n			<fieldset>\n				\n				<div class=\"order-wizard-paymentmethod-giftcertificates-module-form-input-container\">\n					<input type=\"text\" class=\"order-wizard-paymentmethod-giftcertificates-module-form-input\" name=\"code\">\n				</div>\n				<div class=\"order-wizard-paymentmethod-giftcertificates-module-form-submit-container\">\n					<button type=\"submit\" class=\"order-wizard-paymentmethod-giftcertificates-module-form-submit\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Apply",{"name":"translate","hash":{},"data":data}))
    + "\n				</button>\n				</div>\n\n				<div data-type=\"alert-placeholder-gif-certificate\"></div>\n			</fieldset>\n		</div>\n	</form>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"hasGiftCertificates") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<div data-cms-area=\"order_wizard_paymentmethod_giftcertificates_cms_area_1\" data-cms-area-filters=\"page_type\"></div>\n</div>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_paymentmethod_giftcertificates_module'; return template;});