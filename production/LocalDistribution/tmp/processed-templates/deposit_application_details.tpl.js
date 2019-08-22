define('deposit_application_details.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "in";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "				<table class=\"deposit-application-details-table\">\n					<thead class=\"deposit-application-details-table-header\">\n						<th class=\"deposit-application-details-table-header-number\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Number",{"name":"translate","hash":{},"data":data}))
    + "</th>\n						<th class=\"deposit-application-details-table-header-transaction-date\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Transaction Date",{"name":"translate","hash":{},"data":data}))
    + "</th>\n						<th class=\"deposit-application-details-table-header-amount\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n					</thead>\n\n					<tbody data-view=\"Invoices.Collection\"></tbody>\n\n					<tfoot>\n						<tr>\n							<td class=\"deposit-application-details-applied-amount\" colspan=\"3\">\n								<span class=\"deposit-application-details-applied-amount-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Applied Amount:",{"name":"translate","hash":{},"data":data}))
    + " </span>\n								<span class=\"deposit-application-details-applied-amount-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n							</td>\n						</tr>\n					</tfoot>\n				</table>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "	<div class=\"deposit-application-details-accordion-divider\">\n		<div class=\"deposit-application-details-accordion-head\">\n			<a class=\"deposit-application-details-accordion-head-toggle-secondary\" data-toggle=\"collapse\" data-target=\"#deposit-application-more-details\" aria-expanded=\"true\" aria-controls=\"deposit-application-more-details\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"More Details",{"name":"translate","hash":{},"data":data}))
    + "\n				<i class=\"deposit-application-details-accordion-toggle-icon-secondary\"></i>\n			</a>\n		</div>\n		<div class=\"deposit-application-details-accordion-body collapse\" id=\"deposit-application-more-details\" role=\"tabpanel\" data-target=\"#deposit-application-more-details\">\n			<div class=\"deposit-application-details-accordion-container\">\n				<div class=\"deposit-application-details-info-card\">\n					<p>"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Memo:",{"name":"translate","hash":{},"data":data}))
    + "</p>\n					<p class=\"deposit-application-details-deposit-memo\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"memo") || (depth0 != null ? compilerNameLookup(depth0,"memo") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"memo","hash":{},"data":data}) : helper)))
    + "</p>\n				</div>\n			</div>\n		</div>\n	</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<section>\n	<a href=\"/transactionhistory\" class=\"deposit-application-details-back-btn\">\n		"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"&lt; Back to Transaction History",{"name":"translate","hash":{},"data":data}))
    + "\n	</a>\n	<header>\n		<h2 class=\"deposit-application-details-title\">\n			"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Deposit Application <span class=\"deposit-application-details-deposit-number\">#$(0)</span>",(depth0 != null ? compilerNameLookup(depth0,"tranId") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n			<span class=\"deposit-application-details-deposit-amount\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n		</h2>\n\n	</header>\n\n	<div class=\"deposit-application-details-header-information\">\n		<div class=\"deposit-application-details-row\">\n			<div class=\"deposit-application-details-header-information-container\">\n				<p class=\"deposit-application-details-transaction-date-info\">\n				<span class=\"deposit-application-details-transaction-date-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Transaction Date: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n				<span class=\"deposit-application-details-transaction-date-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"tranDate") || (depth0 != null ? compilerNameLookup(depth0,"tranDate") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"tranDate","hash":{},"data":data}) : helper)))
    + "</span>\n				</p>\n				<p class=\"deposit-application-details-from-info\">\n					<span class=\"deposit-application-details-from-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"From:",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					<span class=\"deposit-application-details-from-link\"><a href=\"/transactionhistory/customerdeposit/"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"depositInternalId") || (depth0 != null ? compilerNameLookup(depth0,"depositInternalId") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"depositInternalId","hash":{},"data":data}) : helper)))
    + "\" class=\"deposit-application-details-deposit-link\">\n						"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"depositName") || (depth0 != null ? compilerNameLookup(depth0,"depositName") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"depositName","hash":{},"data":data}) : helper)))
    + "\n					</a></span>\n				</p>\n				<p class=\"deposit-application-details-deposit-date-info\">\n					<span class=\"deposit-application-details-deposit-date-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Deposit Date:",{"name":"translate","hash":{},"data":data}))
    + "</span>\n					<span class=\"deposit-application-details-deposit-date-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"depositDate") || (depth0 != null ? compilerNameLookup(depth0,"depositDate") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"depositDate","hash":{},"data":data}) : helper)))
    + "</span>\n				</p>\n			</div>\n		</div>\n	</div>\n\n	<div class=\"deposit-application-details-accordion-divider\">\n		<div class=\"deposit-application-details-accordion-head\">\n			<a class=\"deposit-application-details-accordion-head-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#deposit-application-applied-to-invoices\" aria-expanded=\"true\" aria-controls=\"deposit-application-applied-to-invoices\">\n				"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Applied to Invoices",{"name":"translate","hash":{},"data":data}))
    + "\n				<i class=\"deposit-application-details-accordion-toggle-icon\"></i>\n			</a>\n		</div>\n		<div class=\"deposit-application-details-accordion-body collapse "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showOpenedAccordion") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"deposit-application-applied-to-invoices\" role=\"tabpanel\" data-target=\"#deposit-application-applied-to-invoices\">\n			<div class=\"deposit-application-details-accordion-container-table\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showInvoices") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "			</div>\n		</div>\n	</div>\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showMemo") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</section>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; ctx._theme_path = 'http://localhost:7778/tmp/extensions/Borg/borg_production_theme/19.1.1/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'deposit_application_details'; return template;});