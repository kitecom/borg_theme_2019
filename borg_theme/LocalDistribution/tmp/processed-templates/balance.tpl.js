define('balance.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "	<a href=\"/\" class=\"balance-button-back\">\n		<i class=\"balance-button-back-icon\"></i>\n		"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Back to Account",{"name":"translate","hash":{},"data":data}))
    + "\n	</a>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "							<span class=\"balance-indicator-title-value\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"company") || (depth0 != null ? compilerNameLookup(depth0,"company") : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"company","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "				<a data-permissions=\"transactions.tranCustPymt.2, transactions.tranCustInvc.1\" href=\"/make-a-payment\" class=\"balance-continue-button\">\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Continue to Payment",{"name":"translate","hash":{},"data":data}))
    + "\n				</a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				<button data-permissions=\"transactions.tranCustPymt.2, transactions.tranCustInvc.1\" class=\"balance-continue-button\" disabled>\n					"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"No Payment Due",{"name":"translate","hash":{},"data":data}))
    + "\n				</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showBackToAccount") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<section class=\"balance\">\n	<div class=\"balance-content\">\n		<h2 class=\"balance-billing-header\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Account Balance",{"name":"translate","hash":{},"data":data}))
    + "\n		</h2>\n\n		<div class=\"balance-billing-account-balance\">\n			\n\n			<div class=\"balance-indicator\">\n\n				<div class=\"balance-indicator-body\">\n					\n					<div class=\"balance-indicator-title\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showCompany") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "					</div>\n\n					<div class=\"balance-indicator-bar\">\n						<div class=\"balance-indicator-bar-progress\" style=\"width: "
    + alias3(((helper = (helper = compilerNameLookup(helpers,"percentage") || (depth0 != null ? compilerNameLookup(depth0,"percentage") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"percentage","hash":{},"data":data}) : helper)))
    + "%;\"></div>\n					</div>\n					\n					<div class=\"balance-indicator-details\">\n						<div class=\"balance-indicator-details-outstanding-balance\">\n							<span class=\"balance-indicator-details-outstanding-reference\"></span>\n							<span class=\"balance-indicator-details-outstanding-label\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Outstanding Balance",{"name":"translate","hash":{},"data":data}))
    + "\n							</span>\n							<span class=\"balance-indicator-details-outstanding-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"balanceFormatted") || (depth0 != null ? compilerNameLookup(depth0,"balanceFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"balanceFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n						</div>\n						<div class=\"balance-indicator-details-available-credit\">\n							<span class=\"balance-indicator-details-available-credit-reference\"></span>\n							<span class=\"balance-indicator-details-available-credit-label\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Available",{"name":"translate","hash":{},"data":data}))
    + "\n							</span>\n							<span class=\"balance-indicator-details-available-credit-value\">\n								"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"balanceAvailableFormatted") || (depth0 != null ? compilerNameLookup(depth0,"balanceAvailableFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"balanceAvailableFormatted","hash":{},"data":data}) : helper)))
    + "\n							</span>\n						</div>\n					</div>\n				</div>\n\n				<div class=\"balance-indicator-summary\">\n					<p class=\"balance-indicator-summary-credit-limit\">\n						"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Credit Limit: <span class=\"balance-indicator-summary-credit-limit-value\">$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"creditLimitFormatted") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n					</p>\n				</div>\n			</div>\n\n			<div class=\"balance-credit-and-account\">\n				<div class=\"balance-summary-credits\">\n					<div class=\"balance-summary-credits-card\">\n						<div class=\"balance-summary-credits-body\">\n							<p class=\"balance-summary-credits-title\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Credits",{"name":"translate","hash":{},"data":data}))
    + "\n							</p>\n							<div class=\"balance-summary-credits-deposits\">\n								 \n								<span class=\"balance-summary-credits-deposits-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Deposits: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n								<span class=\"balance-summary-credits-deposits-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"depositsRemainingFormatted") || (depth0 != null ? compilerNameLookup(depth0,"depositsRemainingFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"depositsRemainingFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n							</div>\n							<div class=\"balance-summary-credits-credit-memos\">\n								<span class=\"balance-summary-credits-credit-memos-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Other Credits: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n								<span class=\"balance-summary-credits-credit-memos-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"creditMemosRemainingFormatted") || (depth0 != null ? compilerNameLookup(depth0,"creditMemosRemainingFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"creditMemosRemainingFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n							</div>\n						</div>\n					</div>\n				</div>\n\n				<div class=\"balance-summary-account-details\">\n					<div class=\"balance-summary-account-details-card\">\n						<div class=\"balance-summary-account-details-body\">\n							<p class=\"balance-summary-account-details-title\">\n								"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Account Details",{"name":"translate","hash":{},"data":data}))
    + "\n							</p>\n							<div class=\"balance-summary-account-terms\">\n								<span class=\"balance-summary-account-terms-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Term: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n								<span class=\"balance-summary-account-terms-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"paymentTermsName") || (depth0 != null ? compilerNameLookup(depth0,"paymentTermsName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"paymentTermsName","hash":{},"data":data}) : helper)))
    + "</span>\n							</div>\n							<div class=\"balance-summary-account-currency\">\n								<span class=\"balance-summary-account-currency-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Currency: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n								<span class=\"balance-summary-account-currency-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"shopperCurrencyCode") || (depth0 != null ? compilerNameLookup(depth0,"shopperCurrencyCode") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"shopperCurrencyCode","hash":{},"data":data}) : helper)))
    + "</span>\n							</div>\n						</div>\n					</div>\n				</div>\n			</div>\n\n		</div>\n	</div>\n	<div class=\"balance-actions\">\n		<div class=\"balance-actions-proceed\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"livePaymentHaveInvoices") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "		</div>\n		<div class=\"balance-actions-print\">\n			<a href=\"/printstatement\" data-permissions=\"transactions.tranStatement.2\" class=\"balance-print-button\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Print a Statement",{"name":"translate","hash":{},"data":data}))
    + "\n			</a>\n		</div>\n	</div>\n</section>\n\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/Borg/Borg_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'balance'; return template;});