define('credit_memo_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "\n						<table class=\"credit-memo-details-table-product\">\n							<thead class=\"credit-memo-details-table-invoices-header\">\n								<th class=\"credit-memo-details-table-invoices-header-title-record\"></th>\n								<th class=\"credit-memo-details-table-invoices-header-date-record\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Date",{"name":"translate","hash":{},"data":data}))
    + "</th>\n								<th class=\"credit-memo-details-table-invoices-header-amount-record\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n							</thead>\n\n\n							<tbody data-view=\"Invoices.Collection\"></tbody>\n\n							<tfoot>\n							<tr>\n							<td class=\"credit-memo-details-accordion-body-container-payment-total\" colspan=\"3\">\n								<p><span class=\"credit-memo-details-accordion-body-container-payment-total-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Applied Subtotal: ",{"name":"translate","hash":{},"data":data}))
    + "</span> <span class=\"credit-memo-details-accordion-body-container-payment-total-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"amountPaidFormatted") || (depth0 != null ? compilerNameLookup(depth0,"amountPaidFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"amountPaidFormatted","hash":{},"data":data}) : helper)))
    + "</span></p>\n								<p><span class=\"credit-memo-details-accordion-body-container-payment-total-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Remaining subtotal: ",{"name":"translate","hash":{},"data":data}))
    + "</span> <span class=\"credit-memo-details-accordion-body-container-payment-total-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"amountRemainingFormatted") || (depth0 != null ? compilerNameLookup(depth0,"amountRemainingFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"amountRemainingFormatted","hash":{},"data":data}) : helper)))
    + "</span></p>\n							</td>\n							</tr>\n							</tfoot>\n						</table>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "						<div class=\"credit-memo-details-accordion-body-container-message\">\n							<p>"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"This Credit Memo has not been applied to any invoices yet.",{"name":"translate","hash":{},"data":data}))
    + "</p>\n						</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "			<div class=\"credit-memo-details-accordion-divider\">\n				<div class=\"credit-memo-details-accordion-head\">\n					<a class=\"credit-memo-details-accordion-head-toggle\" data-toggle=\"collapse\" data-target=\"#credit-memo-details-memo\" aria-expanded=\"true\" aria-controls=\"credit-memo-details-memo\">\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"More Details",{"name":"translate","hash":{},"data":data}))
    + "\n					<i class=\"credit-memo-details-accordion-toggle-icon\"></i>\n					</a>\n				</div>\n				<div class=\"credit-memo-details-accordion-body collapse in\" id=\"credit-memo-details-memo\" role=\"tabpanel\" data-target=\"#credit-memo-details-memo\">\n					<div class=\"credit-memo-details-accordion-body-container-message\">\n						<p>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Memo:",{"name":"translate","hash":{},"data":data}))
    + " <span class=\"credit-memo-details-memo\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"memo") || (depth0 != null ? compilerNameLookup(depth0,"memo") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"memo","hash":{},"data":data}) : helper)))
    + "</span></p>\n					</div>\n				</div>\n			</div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "								"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"itemsQuantityNumber") || (depth0 != null ? compilerNameLookup(depth0,"itemsQuantityNumber") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"itemsQuantityNumber","hash":{},"data":data}) : helper)))
    + " "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Items",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "								"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"itemsQuantityNumber") || (depth0 != null ? compilerNameLookup(depth0,"itemsQuantityNumber") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"itemsQuantityNumber","hash":{},"data":data}) : helper)))
    + " "
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Item",{"name":"translate","hash":{},"data":data}))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<a href=\"/transactionhistory\" class=\"credit-memo-details-back\">\n	"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"&lt; Back to Transaction History",{"name":"translate","hash":{},"data":data}))
    + "\n</a>\n<section class=\"credit-memo-details\">\n	<header class=\"credit-memo-details-header\">\n		<h2 class=\"credit-memo-details-title\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Credit Memo #$(0)",(depth0 != null ? compilerNameLookup(depth0,"tranId") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n			<span class=\"credit-memo-details-header-payment-amount\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n		</h2>\n	</header>\n\n	<div class=\"credit-memo-details-information\">\n		<div class=\"credit-memo-details-information-col-date\">\n			<p class=\"credit-memo-details-information-col-date-text\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<span class=\"credit-memo-details-date-label\">Date: </span> <span  class=\"credit-memo-details-information-date\">$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"tranDate") : depth0),{"name":"translate","hash":{},"data":data}))
    + "</p>\n		</div>\n		<div class=\"credit-memo-details-information-col-status\">\n			<p class=\"credit-memo-details-information-col-status-text\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<span class=\"credit-memo-details-status-label\">Status: </span> <span  class=\"credit-memo-details-information-status\">$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"status") : depth0),{"name":"translate","hash":{},"data":data}))
    + "</p>\n		</div>\n	</div>\n\n	<div class=\"credit-memo-details-row\">\n		<div class=\"credit-memo-details-content-col\">\n			<div class=\"credit-memo-details-accordion-divider\">\n				<div class=\"credit-memo-details-accordion-head\">\n					<a class=\"credit-memo-details-accordion-head-toggle\" data-toggle=\"collapse\" data-target=\"#credit-memo-details-products\" aria-expanded=\"true\" aria-controls=\"credit-memo-details-products\">\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Product",{"name":"translate","hash":{},"data":data}))
    + "\n					<i class=\"credit-memo-details-accordion-toggle-icon\"></i>\n					</a>\n				</div>\n				<div class=\"credit-memo-details-accordion-body collapse in\" id=\"credit-memo-details-products\" role=\"tabpanel\" data-target=\"#credit-memo-details-products\">\n					<div data-content=\"items-body\">\n\n						<table class=\"credit-memo-details-table-flex-item-navigable\">\n							<thead class=\"credit-memo-details-table-products-header\">\n								<th class=\"credit-memo-details-table-products-header-image\"></th>\n								<th class=\"credit-memo-details-table-products-header-product\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Product",{"name":"translate","hash":{},"data":data}))
    + "</th>\n								<th class=\"credit-memo-details-table-products-header-qty\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Quantity",{"name":"translate","hash":{},"data":data}))
    + "</th>\n								<th class=\"credit-memo-details-table-products-header-amount\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n							</thead>\n							<tbody data-view=\"Items.Collection\"></tbody>\n						</table>\n\n						<div class=\"credit-memo-details-accordion-body-container-payment-total\">\n							<p><span class=\"credit-memo-details-accordion-body-container-payment-total-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Items subtotal: ",{"name":"translate","hash":{},"data":data}))
    + "</span> <span class=\"credit-memo-details-accordion-body-container-payment-total-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"subTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"subTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"subTotalFormatted","hash":{},"data":data}) : helper)))
    + "</span></p>\n						</div>\n					</div>\n				</div>\n			</div>\n\n			<div class=\"credit-memo-details-accordion-divider\">\n				<div class=\"credit-memo-details-accordion-head\">\n					<a class=\"credit-memo-details-accordion-head-toggle\" data-toggle=\"collapse\" data-target=\"#credit-memo-details-invoice\" aria-expanded=\"true\" aria-controls=\"credit-memo-details-products\">\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Applied to Invoices",{"name":"translate","hash":{},"data":data}))
    + "\n					<i class=\"credit-memo-details-accordion-toggle-icon\"></i>\n					</a>\n				</div>\n				<div class=\"credit-memo-details-accordion-body collapse in\" id=\"credit-memo-details-invoice\" role=\"tabpanel\" data-target=\"#credit-memo-details-invoice\">\n					<div data-content=\"items-body\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showInvoicesDetails") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "					</div>\n				</div>\n			</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showMemoDetails") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n\n		<div class=\"credit-memo-details-summary-col\">\n\n			<div class=\"credit-memo-details-row-fluid\">\n				<div class=\"credit-memo-details-summary-container\">\n					<h3 class=\"credit-memo-details-summary-title\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"ITEMS SUMMARY",{"name":"translate","hash":{},"data":data}))
    + "</h3>\n					<p class=\"credit-memo-details-summary-grid-float\">\n						<span class=\"credit-memo-details-summary-subtotal\">\n							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"subTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"subTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"subTotalFormatted","hash":{},"data":data}) : helper)))
    + "\n						</span>\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Subtotal",{"name":"translate","hash":{},"data":data}))
    + "\n						<span class=\"credit-memo-details-summary-items\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linesitemsNumberGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "						</span>\n					</p>\n					<p class=\"credit-memo-details-summary-grid-float\">\n						<span class=\"credit-memo-details-summary-discount\">\n							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"discountFormatted") || (depth0 != null ? compilerNameLookup(depth0,"discountFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"discountFormatted","hash":{},"data":data}) : helper)))
    + "\n						</span>\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Discount",{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n					<p class=\"credit-memo-details-summary-grid-float\">\n						<span class=\"credit-memo-details-summary-tax\">\n							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"taxTotalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"taxTotalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"taxTotalFormatted","hash":{},"data":data}) : helper)))
    + "\n						</span>\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Tax Item",{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n					<p class=\"credit-memo-details-summary-grid-float\">\n						<span class=\"credit-memo-details-summary-shipping-cost\">\n							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"shippingCostFormatted") || (depth0 != null ? compilerNameLookup(depth0,"shippingCostFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"shippingCostFormatted","hash":{},"data":data}) : helper)))
    + "\n						</span>\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Shipping Cost",{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n					<div class=\"credit-memo-details-summary-total-container\">\n						<p class=\"credit-memo-details-summary-grid-float\">\n							<span class=\"credit-memo-details-summary-total\">\n								"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "\n							</span>\n							"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Total",{"name":"translate","hash":{},"data":data}))
    + "\n						</p>\n					</div>\n				</div>\n\n				<div class=\"credit-memo-details-buttons-container\">\n					<a href=\""
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"downloadPDFURL") || (depth0 != null ? compilerNameLookup(depth0,"downloadPDFURL") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"downloadPDFURL","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" target=\"_blank\" class=\"credit-memo-details-button-download-as-pdf\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Download as PDF",{"name":"translate","hash":{},"data":data}))
    + "</a>\n				</div>\n			</div>\n\n		</div>\n	</div>\n\n\n</section>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'credit_memo_details'; return template;});