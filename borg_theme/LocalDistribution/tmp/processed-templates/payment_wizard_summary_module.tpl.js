define('payment_wizard_summary_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "				<div class=\"payment-wizard-summary-module-deposits-subtotal\">\n					<p class=\"payment-wizard-summary-module-grid-float\">\n						<span class=\"payment-wizard-summary-module-deposits-subtotal-value\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"depositTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"depositTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"depositTotalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n						"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Deposits Subtotal",{"name":"translate","hash":{},"data":data}))
    + "\n						\n					</p>\n				</div>\n				<div class=\"payment-wizard-summary-module-credits-subtotal\">\n					<p class=\"payment-wizard-summary-module-grid-float\">\n					<span class=\"payment-wizard-summary-module-credits-subtotal-value\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"creditTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"creditTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"creditTotalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n						"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Credits Subtotal",{"name":"translate","hash":{},"data":data}))
    + "\n						\n					</p>\n				</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "						<span class=\"payment-wizard-summary-module-estimated-total-value\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"invoiceTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"invoiceTotalFormatted") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"invoiceTotalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "						<span class=\"payment-wizard-summary-module-estimated-total-value\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"paymentFormatted") || (depth0 != null ? compilerNameLookup(depth0,"paymentFormatted") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"paymentFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				<div class=\"payment-wizard-summary-module-alert-information\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Add your credit card security code (CSC/CVV) before submitting the payment",{"name":"translate","hash":{},"data":data}))
    + "\n				</div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showPaymentMethodRequireLabel") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    return "					<div class=\"payment-wizard-summary-module-alert-information\">\n						"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Payment method is not required",{"name":"translate","hash":{},"data":data}))
    + "\n					</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div class=\"payment-wizard-summary-module\">\n	<div class=\"payment-wizard-summary-module-container\">\n		<header class=\"payment-wizard-summary-module-header\">\n			<h3 class=\"payment-wizard-summary-module-title\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Payment Summary",{"name":"translate","hash":{},"data":data}))
    + "\n			</h3>\n		</header>\n		<div class=\"payment-wizard-summary-module-body\">\n			<div class=\"payment-wizard-summary-module-invoices\">\n				<p class=\"payment-wizard-summary-module-grid-float\">\n					<span class=\"payment-wizard-summary-module-invoices-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"invoiceTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"invoiceTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"invoiceTotalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Invoices (<span class=\"payment-wizard-summary-module-invoices-number\">$(0)</span>)",(depth0 != null ? compilerNameLookup(depth0,"selectedInvoicesLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n					\n				</p>\n			</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showTotalLabel") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			<div class=\"payment-wizard-summary-module-estimated\">\n				<p class=\"payment-wizard-summary-module-grid-float\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showEstimatedAsInvoiceTotal") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "					"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalLabel") || (depth0 != null ? compilerNameLookup(depth0,"totalLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"totalLabel","hash":{},"data":data}) : helper)))
    + "\n				</p>\n			</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showCreditCardInformatioRequrieLabel") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "			\n		</div>\n	</div>\n	<div class=\"payment-wizard-summary-module-buttons-container\">\n		<button class=\"payment-wizard-summary-module-button-continue\" data-action=\"submit-step\" "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"continueButtonDisabled") || (depth0 != null ? compilerNameLookup(depth0,"continueButtonDisabled") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"continueButtonDisabled","hash":{},"data":data}) : helper)))
    + " >\n			"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"continueButtonLabel") || (depth0 != null ? compilerNameLookup(depth0,"continueButtonLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"continueButtonLabel","hash":{},"data":data}) : helper)))
    + "\n		</button>\n	</div>\n</div>\n\n\n\n\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'payment_wizard_summary_module'; return template;});