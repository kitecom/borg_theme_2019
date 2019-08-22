define('order_wizard_showpayments_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "			<div class=\"order-wizard-showpayments-module-billing-address\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showBillingAddress") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "			</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "				<h3 class=\"order-wizard-showpayments-module-section-header\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Billing Address",{"name":"translate","hash":{},"data":data}))
    + "\n				</h3>\n					<div data-view=\"Billing.Address\"></div>		\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "					<a class=\"order-wizard-showpayments-module-billing-address-edit\" data-action=\"edit-module\" href=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"editBillingUrl") || (depth0 != null ? compilerNameLookup(depth0,"editBillingUrl") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"editBillingUrl","hash":{},"data":data}) : helper)))
    + "?force=true\">\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Please select a valid billing address",{"name":"translate","hash":{},"data":data}))
    + "\n					</a>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "				<h3 class=\"order-wizard-showpayments-module-section-header\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Payment Type",{"name":"translate","hash":{},"data":data}))
    + "\n				</h3>\n				<div class=\"order-wizard-showpayments-module-payment-methods-summary\">\n					<div data-view=\"PaymentMethods.Collection\"></div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showGiftcertificates") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showGuestEmail") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "				</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "						<br>\n						<b>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Gift Certificates",{"name":"translate","hash":{},"data":data}))
    + "</b><br>\n						<div data-view=\"GiftCertificates.Collection\"></div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "						<div>\n							<h5>"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"guestEmail") || (depth0 != null ? compilerNameLookup(depth0,"guestEmail") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"guestEmail","hash":{},"data":data}) : helper)))
    + "</h5>\n						</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<section class=\"order-wizard-showpayments-module-details\">\n	<div class=\"order-wizard-showpayments-module-details-body\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBilling") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		\n		<div class=\"order-wizard-showpayments-module-payment-method\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPayments") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n\n	</div>\n</section>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/borg_production_theme/19.1.2/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_wizard_showpayments_module'; return template;});