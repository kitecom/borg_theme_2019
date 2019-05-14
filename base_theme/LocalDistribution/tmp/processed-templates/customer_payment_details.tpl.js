define('customer_payment_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "		<div class=\"customer-payment-details-message-warning\">\n			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"The payment process of this purchase was not completed. To place order, please <a href=\"$(0)\">finalize your payment.</a>",(depth0 != null ? compilerNameLookup(depth0,"redirectUrl") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n		</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "in";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<table class=\"customer-payment-details-accordion-body-container-recordviews-table\">\n				<thead class=\"customer-payment-details-accordion-body-container-recordviews-table-header\">\n					<tr>\n						<th class=\"customer-payment-details-accordion-body-container-recordviews-title\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Number",{"name":"translate","hash":{},"data":data}))
    + "\n						</th>\n						<th class=\"customer-payment-details-accordion-body-container-recordviews-date\" data-name=\"date\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Date",{"name":"translate","hash":{},"data":data}))
    + "\n						</th>\n						<th class=\"customer-payment-details-accordion-body-container-recordviews-discount\" data-name=\"discount\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Disc",{"name":"translate","hash":{},"data":data}))
    + "\n						</th>\n						<th class=\"customer-payment-details-accordion-body-container-recordviews-currency\" data-name=\"amount\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "\n						</th>\n					</tr>\n				</thead>\n\n				<tbody data-view=\"Invoices.Collection\"></tbody>\n\n				<tfoot>\n					<tr>\n					<td colspan=\"4\" class=\"customer-payment-details-accordion-body-container-payment-total\">\n						<p>\n						<span class=\"customer-payment-details-payment-total-label\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Payment Total: ",{"name":"translate","hash":{},"data":data}))
    + "\n						</span>\n						<span class=\"customer-payment-details-payment-total-value\">\n							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"paymentFormatted") || (depth0 != null ? compilerNameLookup(depth0,"paymentFormatted") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"paymentFormatted","hash":{},"data":data}) : helper)))
    + "\n						</span>\n\n						</p>\n					</td>\n					</tr>\n				</tfoot>\n			</table>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "			<div class=\"customer-payment-details-noinvoices-message\">\n				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"This payment is not applied to any invoices.",{"name":"translate","hash":{},"data":data}))
    + "\n			</div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "					<div class=\"customer-payment-details-accordion-body-container-payment-method\">\n						<div class=\"customer-payment-details-accordion-body-container-payment-method-card\">\n							<div data-view=\"PaymentMethod\"></div>\n						</div>\n					</div>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "					<div class=\"customer-payment-details-accordion-body-container-payment-memo\">\n						<div class=\"customer-payment-details-accordion-body-container-payment-memo-card\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Memo:",{"name":"translate","hash":{},"data":data}))
    + "\n							<div class=\"customer-payment-details-accordion-body-container-payment-memo-card-info\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"memo") || (depth0 != null ? compilerNameLookup(depth0,"memo") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"memo","hash":{},"data":data}) : helper)))
    + "</div>\n						</div>\n					</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<a href=\"/transactionhistory\" class=\"customer-payment-details-back\">\n	"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"&lt; Back to Transaction History",{"name":"translate","hash":{},"data":data}))
    + "\n</a>\n\n<section class=\"customer-payment-details\">\n	<header class=\"customer-payment-details-header\">\n		<h2>\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Payment <span class=\"customer-payment-details-header-number\">#$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"tranId") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n			<span class=\"customer-payment-details-header-amount\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"paymentFormatted") || (depth0 != null ? compilerNameLookup(depth0,"paymentFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"paymentFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n		</h2>\n	</header>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPaymentEventFail") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n	<div class=\"customer-payment-details-information\">\n		<div class=\"customer-payment-details-information-col-date\">\n			<p class=\"customer-payment-details-information-col-date-text\">\n				<span class=\"customer-payment-details-information-col-status-label\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Date:",{"name":"translate","hash":{},"data":data}))
    + " </span>\n				<span class=\"customer-payment-details-information-date\">\n				"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"tranDate") || (depth0 != null ? compilerNameLookup(depth0,"tranDate") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"tranDate","hash":{},"data":data}) : helper)))
    + "\n				</span>\n			</p>\n		</div>\n		<div class=\"customer-payment-details-information-col-status\">\n			<p class=\"customer-payment-details-information-col-status-text\">\n				<span class=\"customer-payment-details-information-col-status-label\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Status: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n				<span class=\"customer-payment-details-information-status\">\n				"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"status") || (depth0 != null ? compilerNameLookup(depth0,"status") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\n				</span>\n			</p>\n			<a href=\""
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"downloadPDFURL") || (depth0 != null ? compilerNameLookup(depth0,"downloadPDFURL") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"downloadPDFURL","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" target=\"_blank\" class=\"customer-payment-details-information-col-button\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Download as PDF",{"name":"translate","hash":{},"data":data}))
    + "\n			</a>\n		</div>\n	</div>\n\n	<div class=\"customer-payment-details-accordion-head\">\n		<a class=\"customer-payment-details-accordion-head-toggle\" data-toggle=\"collapse\" data-target=\"#invoice-items\" aria-expanded=\"true\" aria-controls=\"invoice-items\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Invoices",{"name":"translate","hash":{},"data":data}))
    + "\n			<i class=\"customer-payment-details-accordion-toggle-icon\"></i>\n		</a>\n	</div>\n	<div class=\"customer-payment-details-accordion-body collapse "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showOpenedAccordion") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"invoice-items\" role=\"tabpanel\" data-target=\"#invoice-items\">\n		<div class=\"customer-payment-details-accordion-container\" data-content=\"order-items-body\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showInvoices") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "		</div>\n	</div>\n\n	<div class=\"customer-payment-details-accordion-head\">\n		<a class=\"customer-payment-details-accordion-head-toggle\" data-toggle=\"collapse\" data-target=\"#billing-payment-items\" aria-expanded=\"true\" aria-controls=\"billing-payment-items\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Billing & Payment Method",{"name":"translate","hash":{},"data":data}))
    + "\n			<i class=\"customer-payment-details-accordion-toggle-icon\"></i>\n		</a>\n	</div>\n	<div class=\"customer-payment-details-accordion-body collapse "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showOpenedAccordion") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"billing-payment-items\" role=\"tabpanel\" data-target=\"#billing-payment-items\">\n		<div class=\"customer-payment-details-accordion-container\" data-content=\"order-items-body\">\n			<div class=\"customer-payment-details-accordion-body-container\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPaymentMethod") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showMemo") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\n		</div>\n	</div>\n\n</section>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'customer_payment_details'; return template;});