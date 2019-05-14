define('payment_wizard_credit_transaction_module.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "data-manage=\"payment-wizard-credits-accordion\"";
},"3":function(container,depth0,helpers,partials,data) {
    return "data-manage=\"payment-wizard-deposits-accordion\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Credits (<span class=\"payment-wizard-credit-transaction-module-credits-count\">$(0)</span>)",(depth0 != null ? compilerNameLookup(depth0,"collectionLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Deposits (<span class=\"payment-wizard-credit-transaction-module-deposits-count\">$(0)</span>)",(depth0 != null ? compilerNameLookup(depth0,"collectionLength") : depth0),{"name":"translate","hash":{},"data":data}))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "							<span class=\"payment-wizard-credit-transaction-module-subtotal-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Credits Subtotal: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n							<span class=\"payment-wizard-credit-transaction-module-subtotal-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "							<span class=\"payment-wizard-credit-transaction-module-subtotal-label\">"
    + alias3((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Deposits Subtotal: ",{"name":"translate","hash":{},"data":data}))
    + "</span>\n							<span class=\"payment-wizard-credit-transaction-module-subtotal-value\">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"totalFormatted") || (depth0 != null ? compilerNameLookup(depth0,"totalFormatted") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"totalFormatted","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"payment-wizard-credit-transaction-module\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTransactionTypeCredit") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ">\n	<div class=\"payment-wizard-credit-transaction-module-expander-head\">\n		<a class=\"payment-wizard-credit-transaction-module-expander-head-toggle\" data-toggle=\"collapse\" data-target=\"#"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"accordionId") || (depth0 != null ? compilerNameLookup(depth0,"accordionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"accordionId","hash":{},"data":data}) : helper)))
    + "\" aria-expanded=\"false\" aria-controls=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"accordionId") || (depth0 != null ? compilerNameLookup(depth0,"accordionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"accordionId","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTransactionTypeCredit") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "			<i class=\"payment-wizard-credit-transaction-module-expander-head-toggle-icon\"></i>\n		</a>\n	</div>\n\n	<div class=\"payment-wizard-credit-transaction-module-expander-body collapse in\" id=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"accordionId") || (depth0 != null ? compilerNameLookup(depth0,"accordionId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"accordionId","hash":{},"data":data}) : helper)))
    + "\">\n\n		<table class=\"payment-wizard-credit-transaction-module-records\">\n			<thead class=\"payment-wizard-credit-transaction-module-records-head\">\n				<tr class=\"payment-wizard-credit-transaction-module-records-head-row\">\n					<th></th>\n					<th></th>\n					<th>"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Original amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n					<th>"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Remaining amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n					<th>"
    + alias4((compilerNameLookup(helpers,"translate") || (depth0 && compilerNameLookup(depth0,"translate")) || alias2).call(alias1,"Amount",{"name":"translate","hash":{},"data":data}))
    + "</th>\n					<th class=\"payment-wizard-credit-transaction-module-records-action-col\"></th>\n				</tr>\n			</thead>\n\n			<tbody class=\"payment-wizard-credit-transaction-module-records-body\" data-view=\"Transaction.Collection\"></tbody>\n\n			<tfoot class=\"payment-wizard-credit-transaction-module-records-foot\">\n				<tr>\n					<td colspan=\"6\" class=\"payment-wizard-credit-transaction-module-subtotal\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isTransactionTypeCredit") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "")
    + "					</td>\n				</tr>\n			</tfoot>\n		</table>\n	</div>\n</div>\n\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/SuiteCommerce/Suite_Commerce_Base_Theme/19.1.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'payment_wizard_credit_transaction_module'; return template;});