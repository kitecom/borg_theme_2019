define('order_history_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "		<div class=\"order-history-details-message-warning\" data-action=\"go-to-returns\">\n			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"You have returns associated with this order. <a href=\"#\">View Details</a>",{"name":"translate","hash":{},"data":data}))
    + "\n		</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "		<div class=\"order-history-details-message-warning\">\n			"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"The checkout process of this purchase was not completed. To place order, please <a data-navigation=\"ignore-click\" href=\"$(0)\" >finalize your payment.</a>",((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"paymentevent") : stack1)) != null ? compilerNameLookup(stack1,"redirecturl") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n		</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "					<p class=\"order-history-details-header-purchase-order-number-info\">\n						"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span class=\"order-history-details-header-purchase-order-info-purchase-order-number-label\">Purchase Order Number: </span> <span class=\"order-history-details-header-purchase-order-number\">$(0)</span>",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"purchasenumber") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				<p class=\"order-history-details-header-quote-info\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span class=\"order-history-details-header-quote-info-quote-label\">Created from: </span> <a href=\"$(0)\" class=\"order-history-details-header-date\">$(1)</a>",(depth0 != null ? compilerNameLookup(depth0,"quoteURL") : depth0),(depth0 != null ? compilerNameLookup(depth0,"quoteName") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n				<div class=\"order-history-details-accordion-divider\">\n					<div class=\"order-history-details-accordion-head\">\n						<a class=\"order-history-details-accordion-head-toggle-secondary collapsed\" data-toggle=\"collapse\" data-target=\"#products-not-shipp\" aria-expanded=\"true\" aria-controls=\"products-not-shipp\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"nonShippableItemsLengthGreaterThan1") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(12, data, 0),"data":data})) != null ? stack1 : "")
    + "						<i class=\"order-history-details-accordion-toggle-icon-secondary\"></i>\n						</a>\n					</div>\n					<div class=\"order-history-details-accordion-body collapse\" id=\"products-not-shipp\" role=\"tabpanel\" data-target=\"#products-not-shipp\">\n						<div class=\"order-history-details-accordion-container\" data-content=\"order-items-body\">\n							<table class=\"order-history-details-non-shippable-table\">\n								<tbody data-view=\"NonShippableLines\"></tbody>\n							</table>\n						</div>\n					</div>\n				</div>\n\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Products that don't require shipping ($(0))",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"nonShippableLines") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "								"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Product that doesn't require shipping ($(0))",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"nonShippableLines") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "							<div class=\"order-history-details-payment-info-cards\">\n								<div class=\"order-history-details-info-card\">\n									<h5 class=\"order-history-details-info-card-title\">\n										"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(alias1,"Payment Method",{"name":"translate","hash":{},"data":data}))
    + "\n									</h5>\n									<div class=\"order-history-details-info-card-info\">\n										<div data-view='FormatPaymentMethod'></div>\n									</div>\n								</div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBillAddress") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "							</div>\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "								<div class=\"order-history-details-info-card\">\n									<h5 class=\"order-history-details-info-card-title\">\n										"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Bill to",{"name":"translate","hash":{},"data":data}))
    + "\n									</h5>\n									<div class=\"order-history-details-info-card-info-billing\">\n										<div data-view=\"Billing.Address.View\"></div>\n									</div>\n								</div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "				<!-- RETURNS AUTHORIZATIONS -->\n				<div class=\"order-history-details-accordion-divider\">\n					<div class=\"order-history-details-accordion-head collapsed\">\n						<a class=\"order-history-details-accordion-head-toggle-secondary\" data-toggle=\"collapse\" data-target=\"#returns-authorizations\" aria-expanded=\"true\" aria-controls=\"returns-authorizations\">\n						"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"<span>Returns ($(0))</span>",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"returnAuthorizations") : depth0)) != null ? compilerNameLookup(stack1,"totalLines") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n						<i class=\"order-history-details-accordion-toggle-icon-secondary\"></i>\n						</a>\n					</div>\n					<div class=\"order-history-details-accordion-body collapse\" id=\"returns-authorizations\" role=\"tabpanel\" data-target=\"#returns-authorizations\">\n						<div class=\"order-history-details-accordion-container\" data-content=\"order-items-body\">\n							<div data-view=\"ReturnAutorization\"></div>\n						</div>\n					</div>\n				</div>\n				<!-- RETURNS AUTHORIZATIONS ENDS -->\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function", alias5=container.lambda;

  return "<a href=\"/purchases\" class=\"order-history-details-back-btn\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"&lt; Back to Purchases",{"name":"translate","hash":{},"data":data}))
    + "</a>\n<section>\n	<header>\n		<h2 class=\"order-history-details-order-title\" data-origin='"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"originName") || (depth0 != null ? compilerNameLookup(depth0,"originName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"originName","hash":{},"data":data}) : helper)))
    + "'>\n			<span class=\"order-history-details-order-title\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " </span><b> <span class=\"order-history-details-order-number\">"
    + alias3(alias5(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"tranid") : stack1), depth0))
    + "</span></b>\n			<span class=\"order-history-details-total-formatted\">\n				"
    + alias3(alias5(((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"summary") : stack1)) != null ? compilerNameLookup(stack1,"total_formatted") : stack1), depth0))
    + "\n			</span>\n		</h2>\n	</header>\n\n	<div data-type=\"alert-placeholder\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showReturnAuthorizations") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPaymentEventFail") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n	<!-- HEADER INFORMATION -->\n	<div class=\"order-history-details-header-information\">\n		<div class=\"order-history-details-header-row\">\n			<div class=\"order-history-details-header-col-left\">\n				<p class=\"order-history-details-header-date-info\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<span class=\"order-history-details-header-date-info-date-label\">Date: </span> <span class=\"order-history-details-header-date\">$(0)</span>",((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"trandate") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPurchaseOrderNumber") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showQuoteDetail") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\n			<div class=\"order-history-details-header-col-right\">\n				<p class=\"order-history-details-header-status-info\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<strong>Status: </strong> <span class=\"order-history-details-header-status\">$(0)</span>",((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"status") : stack1)) != null ? compilerNameLookup(stack1,"name") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n			</div>\n			<div class=\"order-history-details-header-amount\">\n				<p class=\"order-history-details-header-amount-info\">\n					"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"<span class=\"order-history-details-header-amount-info-amount-label\">Amount: </span> <span class=\"order-history-details-header-amount-number\">$(0)</span>",((stack1 = ((stack1 = (depth0 != null ? compilerNameLookup(depth0,"model") : depth0)) != null ? compilerNameLookup(stack1,"summary") : stack1)) != null ? compilerNameLookup(stack1,"total_formatted") : stack1),{"name":"translate","hash":{},"data":data}))
    + "\n				</p>\n			</div>\n\n		</div>\n	</div>\n\n	<div class=\"order-history-details-row\">\n		<div class=\"order-history-details-content-col\">\n\n			<div data-view=\"OrderPackages\"></div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showNonShippableLines") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n			<!-- PAYMENT INFORMATION -->\n			<div class=\"order-history-details-accordion-divider\">\n				<div class=\"order-history-details-accordion-head\">\n					<a class=\"order-history-details-accordion-head-toggle-secondary collapsed\" data-toggle=\"collapse\" data-target=\"#order-payment-info\" aria-expanded=\"true\" aria-controls=\"order-payment-info\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Payment Information",{"name":"translate","hash":{},"data":data}))
    + "\n					<i class=\"order-history-details-accordion-toggle-icon-secondary\"></i>\n					</a>\n				</div>\n				<div class=\"order-history-details-accordion-body collapse\" id=\"order-payment-info\" role=\"tabpanel\" data-target=\"#order-payment-info\">\n					<div class=\"order-history-details-accordion-container\" data-content=\"order-items-body\">\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showPaymentMethod") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n						<div class=\"order-history-details-payment\" data-view=\"Payments\"></div>\n\n						<div class=\"order-history-details-payment-others\" data-view=\"OtherPayments\"></div>\n\n					</div>\n				</div>\n			</div>\n\n			<!-- PAYMENT INFORMATION ENDS -->\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showReturnAuthorizations") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</div>\n\n		<!-- SUMMARY -->\n		<div class=\"order-history-details-summary\" data-view=\"Summary\"></div>\n		<!-- SUMMARY ENDS -->\n	</div>\n</section>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'order_history_details'; return template;});